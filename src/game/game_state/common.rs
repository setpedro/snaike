use crate::{
    game::{
        constants::{CELL_SIZE_PX, GRID_COLS, GRID_ROWS},
        enums::{Collision, GameEndCause, Winner},
        game_state::{
            callbacks::{game_end, on_score_update},
            utils::is_out_of_bounds,
        },
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
    game_start_time: Option<f64>,
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
            game_start_time: None,
        }
    }

    pub(crate) fn check_and_start_timer(&mut self, current_time: f64) {
        if self.game_start_time.is_none() && self.human.core.direction != (0, 0) {
            self.game_start_time = Some(current_time);
        }
    }

    pub(crate) fn get_game_duration(&self, current_time: f64) -> Option<f64> {
        self.game_start_time.map(|start| current_time - start)
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

    pub(crate) fn handle_human_collision(&mut self, collision: Collision, current_time: f64) {
        match collision {
            Collision::Wall => {
                let duration = self.get_game_duration(current_time);
                game_end(GameEndCause::Wall)
            }
            Collision::OwnBody => game_end(GameEndCause::SelfCollision),
            Collision::Food => {
                self.human.core.grow();
                self.regenerate_food(None);
                on_score_update((self.human.core.body_segments.len() as i32) - 3)
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

    pub(crate) fn check_winner(&self, ai: Option<&AISnake>) -> Winner {
        let total_cells = (GRID_COLS * GRID_ROWS) as usize;
        let human_snake_cells = (self.human.core.get_body_positions().len() / 2) + 1;

        let ai_snake_cells = if let Some(ai) = ai {
            (ai.core.get_body_positions().len() / 2) + 1
        } else {
            0
        };

        let snake_cells = human_snake_cells + ai_snake_cells;

        if snake_cells < total_cells {
            return Winner::None;
        }

        match ai {
            None => Winner::Human,
            Some(_) => {
                if human_snake_cells > ai_snake_cells {
                    Winner::Human
                } else if ai_snake_cells > human_snake_cells {
                    Winner::Ai
                } else {
                    Winner::Draw
                }
            }
        }
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
