use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{
    game::{
        constants::{CELL_SIZE_PX, GRID_COLS, GRID_ROWS},
        enums::Collision,
        snake::{ai::ai::AISnake, human::human::HumanSnake},
    },
    SnakeCore,
};

#[wasm_bindgen]
pub struct GameState {
    human: HumanSnake,
    ai: AISnake,
    food: (i32, i32),
    occupied_grid: [[bool; GRID_ROWS as usize]; GRID_COLS as usize],
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
    #[wasm_bindgen(js_name = "onGameWin")]
    pub fn on_game_win();
    #[wasm_bindgen(js_name = "onGameDraw")]
    pub fn on_game_draw();
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut game_state = Self {
            human: HumanSnake::new(),
            ai: AISnake::new(),
            food: (0, 0),
            occupied_grid: [[false; GRID_ROWS as usize]; GRID_COLS as usize],
        };

        // TODO: refactor this.
        game_state.update_grid();
        game_state.regenerate_food();
        game_state
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.human.update(delta_time);
        self.ai.update(delta_time, self.food);

        let human_head_position = self.human.core.get_head_pixel_position();
        let ai_head_position = self.ai.core.get_head_pixel_position();

        let human_head_pixel_position =
            (human_head_position[0] as i32, human_head_position[1] as i32);
        let ai_head_pixel_position = (ai_head_position[0] as i32, ai_head_position[1] as i32);

        if let Some(collision) =
            self.check_head_to_head_collision(human_head_pixel_position, ai_head_pixel_position)
        {
            self.handle_snake_collision(collision);
            return;
        }

        // Check body collisions continuously (but using grid positions)
        if let Some(collision) = self.check_human_ai_body_collision_grid() {
            self.handle_snake_collision(collision);
            return;
        }

        if let Some(collision) = self.check_ai_human_body_collision_grid() {
            self.handle_snake_collision(collision);
            return;
        }

        // Handle "static" collisions (snake with stationary entity)
        if self.is_at_node(human_head_position) {
            if let Some(collision) =
                self.check_static_collision(&self.human.core, human_head_pixel_position)
            {
                if self.is_win() {
                    on_game_win();
                    return;
                }
                self.handle_human_collision(collision);
                return;
            }
        }

        if self.is_at_node(ai_head_position) {
            if let Some(collision) =
                self.check_static_collision(&self.ai.core, ai_head_pixel_position)
            {
                self.handle_ai_collision(collision);
                return;
            }
        }
    }

    fn is_at_node(&self, head: Vec<f64>) -> bool {
        ((head[0] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs() < f64::EPSILON
            && ((head[1] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs() < f64::EPSILON
    }

    fn is_out_of_bounds(&self, snake: &SnakeCore) -> bool {
        snake.head_grid_position.0 < 0
            || snake.head_grid_position.0 >= GRID_COLS
            || snake.head_grid_position.1 < 0
            || snake.head_grid_position.1 >= GRID_ROWS
    }

    fn is_win(&self) -> bool {
        let total_cells = (GRID_COLS * GRID_ROWS) as usize;
        let snake_cells = (self.human.core.get_body_positions().len() / 2) + 1;
        snake_cells >= total_cells
    }

    fn handle_human_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody => on_game_over(),
            Collision::Food => {
                self.human.core.grow();
                self.regenerate_food();
            }
            _ => unreachable!(),
        }
    }

    fn handle_ai_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody => on_game_win(),
            Collision::Food => {
                self.ai.core.grow();
                self.regenerate_food();
            }
            _ => unreachable!(),
        }
    }

    fn handle_snake_collision(&mut self, collision: Collision) {
        match collision {
            Collision::HumanHeadToAiHead => on_game_over(),
            Collision::AiHeadToHumanHead => on_game_win(),
            Collision::HumanHeadToAiBody => on_game_over(),
            Collision::AiHeadToHumanBody => on_game_win(),
            Collision::HeadSwap => on_game_draw(),
            _ => unreachable!(),
        }
    }

    fn check_human_ai_body_collision_grid(&self) -> Option<Collision> {
        let human_snake_head_position = self.human.core.head_grid_position;

        for entry in self.ai.core.path_history.iter().skip(1) {
            if entry.grid_position == human_snake_head_position {
                return Some(Collision::HumanHeadToAiBody);
            }
        }
        None
    }

    fn check_ai_human_body_collision_grid(&self) -> Option<Collision> {
        let ai_snake_head_position = self.ai.core.head_grid_position;

        for entry in self.human.core.path_history.iter().skip(1) {
            if entry.grid_position == ai_snake_head_position {
                return Some(Collision::AiHeadToHumanBody);
            }
        }
        None
    }

    fn check_head_to_head_collision(
        &self,
        human_head_pixel_position: (i32, i32),
        ai_head_pixel_position: (i32, i32),
    ) -> Option<Collision> {
        let human_head_grid_position = self.human.core.head_grid_position;
        let ai_head_grid_position = self.ai.core.head_grid_position;

        let human_prev = (
            human_head_grid_position.0 - self.human.core.direction.0,
            human_head_grid_position.1 - self.human.core.direction.1,
        );
        let ai_prev = (
            ai_head_grid_position.0 - self.ai.core.direction.0,
            ai_head_grid_position.1 - self.ai.core.direction.1,
        );

        // Swapped head positions
        if human_head_grid_position == ai_prev && ai_head_grid_position == human_prev {
            return Some(Collision::HeadSwap);
        }

        // No collision
        if human_head_grid_position != ai_head_grid_position {
            return None;
        }

        // TODO: grid to pixel util
        let x_cell_center =
            ((human_head_grid_position.0 as f64 + 0.5) * CELL_SIZE_PX as f64) as i32;
        let y_cell_center =
            ((human_head_grid_position.1 as f64 + 0.5) * CELL_SIZE_PX as f64) as i32;

        let human_cell_center_proximity = (((human_head_pixel_position.0 - x_cell_center).pow(2)
            + (human_head_pixel_position.1 - y_cell_center).pow(2))
            as f64)
            .sqrt();

        let ai_cell_center_proximity = (((ai_head_pixel_position.0 - x_cell_center).pow(2)
            + (ai_head_pixel_position.1 - y_cell_center).pow(2))
            as f64)
            .sqrt();

        if human_cell_center_proximity == ai_cell_center_proximity {
            Some(Collision::HeadSwap)
        } else if human_cell_center_proximity < ai_cell_center_proximity {
            Some(Collision::AiHeadToHumanHead)
        } else {
            Some(Collision::HumanHeadToAiHead)
        }
    }

    fn check_static_collision(
        &self,
        snake: &SnakeCore,
        snake_grid: (i32, i32),
    ) -> Option<Collision> {
        match () {
            _ if self.is_out_of_bounds(snake) => Some(Collision::Wall),
            _ if snake.body_segments.len() > 3 && snake.check_self_collision() => {
                Some(Collision::OwnBody)
            }
            _ if snake_grid == self.food => Some(Collision::Food),
            _ => None,
        }
    }

    fn regenerate_food(&mut self) -> Option<(i32, i32)> {
        self.update_grid();

        let mut candidates = Vec::with_capacity((GRID_COLS * GRID_ROWS) as usize);
        for x in 0..(GRID_COLS as usize) {
            for y in 0..(GRID_ROWS as usize) {
                if !self.occupied_grid[x][y] {
                    candidates.push((
                        x * (CELL_SIZE_PX as usize) + (CELL_SIZE_PX as usize) / 2,
                        y * (CELL_SIZE_PX as usize) + (CELL_SIZE_PX as usize) / 2,
                    ));
                }
            }
        }

        if candidates.is_empty() {
            self.food = (-1, -1);
            None
        } else {
            let choice = candidates[thread_rng().gen_range(0..candidates.len())];
            self.food = (choice.0 as i32, choice.1 as i32);
            Some((choice.0 as i32, choice.1 as i32))
        }
    }

    fn update_grid(&mut self) {
        self.occupied_grid = [[false; (GRID_ROWS as usize)]; (GRID_COLS as usize)];

        // Human snake
        let (x, y) = self.human.core.head_grid_position;
        self.occupied_grid[x as usize][y as usize] = true;
        for entry in &self.human.core.path_history {
            let (x, y) = entry.grid_position;
            self.occupied_grid[x as usize][y as usize] = true;
        }

        // AI snake
        let (x, y) = self.ai.core.head_grid_position;
        self.occupied_grid[x as usize][y as usize] = true;
        for entry in &self.ai.core.path_history {
            let (x, y) = entry.grid_position;
            self.occupied_grid[x as usize][y as usize] = true;
        }
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.food.0, self.food.1]
    }

    #[wasm_bindgen]
    pub fn get_human_snake_position(&self) -> Vec<f64> {
        self.human.core.get_head_pixel_position()
    }

    pub fn get_ai_snake_position(&self) -> Vec<f64> {
        self.ai.core.get_head_pixel_position()
    }

    #[wasm_bindgen]
    pub fn get_human_snake_body_positions(&self) -> Vec<f64> {
        self.human.core.get_body_positions()
    }

    #[wasm_bindgen]
    pub fn get_ai_snake_body_positions(&self) -> Vec<f64> {
        self.ai.core.get_body_positions()
    }

    #[wasm_bindgen]
    pub fn set_input_key(&mut self, key: &str, is_pressed: bool) {
        self.human.input_state.set_key(key, is_pressed);
    }
}
