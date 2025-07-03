use crate::{
    game::{
        constants::{CELL_SIZE_PX, GRID_COLS, GRID_ROWS},
        enums::Collision,
        game_state::{callbacks::on_game_over, utils::is_out_of_bounds},
        snake::ai::ai::AISnake,
    },
    HumanSnake, SnakeCore,
};
use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct GameStateCommon {
    pub(crate) human: HumanSnake,
    pub(crate) food: (i32, i32),
    occupied_grid: [[bool; GRID_ROWS as usize]; GRID_COLS as usize],
}

#[wasm_bindgen]
impl GameStateCommon {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut human = HumanSnake::new();
        human.core.grow_counter = 3;

        Self {
            human,
            food: (0, 0),
            occupied_grid: [[false; GRID_ROWS as usize]; GRID_COLS as usize],
        }
    }

    fn update_grid(&mut self, ai: Option<&AISnake>) {
        self.occupied_grid = [[false; GRID_ROWS as usize]; GRID_COLS as usize];

        // Human snake
        let (x, y) = self.human.core.head_grid_position;
        self.occupied_grid[x as usize][y as usize] = true;
        for entry in &self.human.core.path_history {
            let (x, y) = entry.grid_position;
            self.occupied_grid[x as usize][y as usize] = true;
        }

        // AI snake if provided
        if let Some(ai) = ai {
            let (x, y) = ai.core.head_grid_position;
            self.occupied_grid[x as usize][y as usize] = true;
            for entry in &ai.core.path_history {
                let (x, y) = entry.grid_position;
                self.occupied_grid[x as usize][y as usize] = true;
            }
        }
    }

    pub(crate) fn handle_human_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody => on_game_over(),
            Collision::Food => {
                self.human.core.grow();
                self.regenerate_food(None);
            }
            _ => unreachable!(),
        }
    }

    pub(crate) fn check_static_collision(
        &self,
        snake: &SnakeCore,
        snake_grid: (i32, i32),
    ) -> Option<Collision> {
        match () {
            _ if is_out_of_bounds(snake) => Some(Collision::Wall),
            _ if snake.body_segments.len() > 3 && snake.check_self_collision() => {
                Some(Collision::OwnBody)
            }
            _ if snake_grid == self.food => Some(Collision::Food),
            _ => None,
        }
    }

    pub(crate) fn regenerate_food(&mut self, ai: Option<&AISnake>) -> Option<(i32, i32)> {
        self.update_grid(ai);

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

    pub(crate) fn is_win(&self, ai: Option<&AISnake>) -> bool {
        let total_cells = (GRID_COLS * GRID_ROWS) as usize;
        let human_snake_cells = (self.human.core.get_body_positions().len() / 2) + 1;

        let ai_snake_cells = if let Some(ai) = ai {
            (ai.core.get_body_positions().len() / 2) + 1
        } else {
            0
        };

        let snake_cells = human_snake_cells + ai_snake_cells;

        snake_cells >= total_cells
    }

    pub fn food(&self) -> Vec<i32> {
        vec![self.food.0, self.food.1]
    }

    pub fn get_human_snake_position(&self) -> Vec<f64> {
        self.human.core.get_head_pixel_position()
    }

    pub fn get_human_snake_body_positions(&self) -> Vec<f64> {
        self.human.core.get_body_positions()
    }

    pub fn set_input_key(&mut self, key: &str, is_pressed: bool) {
        self.human.input_state.set_key(key, is_pressed);
    }
}
