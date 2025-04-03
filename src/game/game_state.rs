use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{game::enums::Collision, game::snake::human::human::HumanSnake};

#[wasm_bindgen]
pub struct GameState {
    human: HumanSnake,
    food: (i32, i32),
    occupied_grid: [[bool; 20]; 30],
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut game_state = Self {
            human: HumanSnake::new(),
            food: (0, 0),
            occupied_grid: [[false; 20]; 30],
        };

        // TODO: refactor this.
        game_state.update_grid();
        game_state.regenerate_food();
        game_state
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.human.update(delta_time);

        let head_position = self.human.core.position();

        // Ensures the snake's head is exactly aligned with the grid
        let at_grid_position = ((head_position[0] - 10.0) % 20.0).abs() < f64::EPSILON
            && ((head_position[1] - 10.0) % 20.0).abs() < f64::EPSILON;

        // Collision checks occur only at grid nodes, at least for static entities (food, walls)
        // TODO: Handle head-on collisions between two snakes (not limited to grid nodes)
        if at_grid_position {
            // Uses head_at_grid_position to ensure the snake only eats food when fully aligned with a grid cell, preventing partial overlaps
            let head_at_grid_position = (head_position[0] as i32, head_position[1] as i32);

            let collision: Option<Collision> = match () {
                _ if head_at_grid_position == self.food => Some(Collision::Food),
                _ if self.is_out_of_bounds() => Some(Collision::Wall),
                _ if self.human.core.body_segments.len() > 3 && self.is_self_collided() => {
                    Some(Collision::OwnBody)
                }
                _ => None,
            };

            if let Some(collision_type) = collision {
                self.handle_collision(collision_type);
            }
        }
    }

    fn is_out_of_bounds(&self) -> bool {
        // Uses grid_position to ensure the snake stops immediately when reaching a boundary, avoiding visually going through the wall until reaching the grid node
        self.human.core.grid_position.0 < 0
            || self.human.core.grid_position.0 >= 30
            || self.human.core.grid_position.1 < 0
            || self.human.core.grid_position.1 >= 20
    }

    fn is_self_collided(&self) -> bool {
        self.human.core.check_self_collision()
    }

    fn handle_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Food => {
                self.human.core.grow();
                self.get_food();
            }
            Collision::Wall => on_game_over(),
            Collision::OwnBody => on_game_over(),
        }
    }

    #[wasm_bindgen]
    pub fn get_food(&mut self) -> Vec<i32> {
        self.regenerate_food()
            .map(|(x, y)| vec![x, y])
            .unwrap_or_else(|| vec![-1, -1])
    }

    fn regenerate_food(&mut self) -> Option<(i32, i32)> {
        self.update_grid();
        let mut rng = thread_rng();
        let mut candidates = Vec::with_capacity(600);

        for x in 0..30 {
            for y in 0..20 {
                if !self.occupied_grid[x][y] {
                    candidates.push((x * 20 + 10, y * 20 + 10));
                }
            }
        }

        if candidates.is_empty() {
            None
        } else {
            let choice = candidates[rng.gen_range(0..candidates.len())];
            self.food = (choice.0 as i32, choice.1 as i32);
            Some((choice.0 as i32, choice.1 as i32))
        }
    }

    fn update_grid(&mut self) {
        self.occupied_grid = [[false; 20]; 30];

        // Mark snake head
        let (hx, hy) = self.human.core.grid_position;
        self.occupied_grid[hx as usize][hy as usize] = true;

        // Mark body segments using path history
        for entry in &self.human.core.path_history {
            let (bx, by) = entry.grid_position;
            self.occupied_grid[bx as usize][by as usize] = true;
        }
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.food.0, self.food.1]
    }

    #[wasm_bindgen]
    pub fn get_snake_position(&self) -> Vec<f64> {
        self.human.core.position()
    }

    #[wasm_bindgen]
    pub fn get_snake_direction(&self) -> Vec<i32> {
        self.human.core.direction()
    }

    #[wasm_bindgen]
    pub fn get_body_positions(&self) -> Vec<f64> {
        self.human.core.get_body_positions()
    }

    #[wasm_bindgen]
    pub fn set_input_key(&mut self, key: char, is_pressed: bool) {
        self.human.input_state.set_key(key, is_pressed);
    }
}
