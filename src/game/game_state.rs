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
        self.ai.update(delta_time);

        let human_head_position = self.human.core.position();
        let ai_head_position = self.ai.core.position();

        let human_grid = (human_head_position[0] as i32, human_head_position[1] as i32);
        let ai_grid = (ai_head_position[0] as i32, ai_head_position[1] as i32);

        // Ensures the snake's head is exactly aligned with the grid
        let is_at_node = |head: Vec<f64>| {
            ((head[0] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs() < f64::EPSILON
                && ((head[1] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs()
                    < f64::EPSILON
        };

        if is_at_node(human_head_position) {
            let collision: Option<Collision> = match () {
                _ if self.is_out_of_bounds(&self.human.core) => Some(Collision::Wall),
                _ if self.human.core.body_segments.len() > 3
                    && self.human.core.check_self_collision() =>
                {
                    Some(Collision::OwnBody)
                }
                _ if human_grid == self.food => Some(Collision::Food),
                _ if self.check_human_ai_body_collision() => Some(Collision::Snake),
                _ => None,
            };

            if self.is_win() {
                on_game_win();
                return;
            }

            if let Some(collision_type) = collision {
                self.handle_human_collision(collision_type);
            }
        }

        if is_at_node(ai_head_position) {
            let collision: Option<Collision> = match () {
                _ if self.is_out_of_bounds(&self.ai.core) => Some(Collision::Wall),
                _ if self.ai.core.body_segments.len() > 3
                    && self.ai.core.check_self_collision() =>
                {
                    Some(Collision::OwnBody)
                }
                _ if ai_grid == self.food => Some(Collision::Food),
                _ if self.check_ai_human_body_collision() => Some(Collision::Snake),
                _ => None,
            };

            if let Some(collision_type) = collision {
                self.handle_ai_collision(collision_type);
            }
        }
    }

    fn is_out_of_bounds(&self, snake: &SnakeCore) -> bool {
        snake.grid_position.0 < 0
            || snake.grid_position.0 >= GRID_COLS
            || snake.grid_position.1 < 0
            || snake.grid_position.1 >= GRID_ROWS
    }

    fn is_win(&self) -> bool {
        let total_cells = (GRID_COLS * GRID_ROWS) as usize;
        let snake_cells = (self.human.core.get_body_positions().len() / 2) + 1;
        snake_cells >= total_cells
    }

    fn handle_human_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody | Collision::Snake => on_game_over(),
            Collision::Food => {
                self.human.core.grow();
                self.regenerate_food();
            }
        }
    }

    fn handle_ai_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody => {
                on_game_win(); // Human wins if AI hits wall or self
            }
            Collision::Food => {
                self.ai.core.grow();
                self.regenerate_food();
            }
            Collision::Snake => {}
        }
    }

    fn check_human_ai_body_collision(&self) -> bool {
        let human_snake_head_position = self.human.core.grid_position;
        let ai_body = &self.ai.core.path_history;

        // check if human head collides with ai body
        for entry in ai_body {
            if entry.grid_position == human_snake_head_position {
                return true;
            }
        }
        false
    }

    fn check_ai_human_body_collision(&self) -> bool {
        let ai_snake_head_position = self.ai.core.grid_position;
        let human_body = &self.human.core.path_history;

        // check if ai head collides with human body
        for entry in human_body {
            if entry.grid_position == ai_snake_head_position {
                return true;
            }
        }
        false
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
        let (x, y) = self.human.core.grid_position;
        self.occupied_grid[x as usize][y as usize] = true;
        for entry in &self.human.core.path_history {
            let (x, y) = entry.grid_position;
            self.occupied_grid[x as usize][y as usize] = true;
        }

        // AI snake
        let (x, y) = self.ai.core.grid_position;
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
        self.human.core.position()
    }

    pub fn get_ai_snake_position(&self) -> Vec<f64> {
        self.ai.core.position()
    }

    #[wasm_bindgen]
    pub fn get_human_snake_direction(&self) -> Vec<i32> {
        self.human.core.direction()
    }

    #[wasm_bindgen]
    pub fn get_ai_snake_direction(&self) -> Vec<i32> {
        self.ai.core.direction()
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
