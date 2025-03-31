use enums::Collision;
use game_state::GameState;
use input::InputState;
use wasm_bindgen::prelude::*;

mod enums;
mod game_state;
mod input;

#[wasm_bindgen]
pub struct Rectangle {
    grid_position: (i32, i32),
    visual_position: (f64, f64),
    direction: (i32, i32),
    next_direction: Option<(i32, i32)>,
    speed: f64,
    grid_size: i32,
    target_position: (f64, f64),
    input_state: InputState,
    #[wasm_bindgen(readonly)]
    pub at_grid_position: bool,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
}

#[wasm_bindgen]
impl Rectangle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let grid_pos = (10, 10);
        let grid_size = 20;
        let pixel_x = (grid_pos.0 as f64 + 0.5) * grid_size as f64;
        let pixel_y = (grid_pos.1 as f64 + 0.5) * grid_size as f64;

        Self {
            grid_position: grid_pos,
            visual_position: (pixel_x, pixel_y),
            target_position: (pixel_x, pixel_y),
            direction: (1, 0),
            next_direction: None,
            speed: 7.5,
            grid_size,
            input_state: InputState::new(),
            at_grid_position: true,
        }
    }

    #[wasm_bindgen]
    pub fn set_key(&mut self, key: char, is_pressed: bool) {
        self.input_state.set_key(key, is_pressed);
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.process_input();
        self.update_movement(delta_time);

        // TODO: food collision check to start with
    }

    fn process_input(&mut self) {
        let pressed = self.input_state.pressed;
        let new_dir = match () {
            _ if pressed & 0b0001 != 0 => (0, -1), // Up
            _ if pressed & 0b1000 != 0 => (1, 0),  // Right
            _ if pressed & 0b0100 != 0 => (0, 1),  // Down
            _ if pressed & 0b0010 != 0 => (-1, 0), // Left
            _ => self.direction,                   // Fallback
        };

        if self.is_valid_direction(new_dir) {
            self.next_direction = Some(new_dir);
        }
    }

    fn is_valid_direction(&self, dir: (i32, i32)) -> bool {
        dir != self.direction && !(dir.0 == -self.direction.0 && dir.1 == -self.direction.1)
    }

    fn update_movement(&mut self, delta_time: f64) {
        let move_amount = self.speed * self.grid_size as f64 * delta_time;
        let dx = self.target_position.0 - self.visual_position.0;
        let dy = self.target_position.1 - self.visual_position.1;
        let distance = dx.abs().max(dy.abs());

        if distance <= move_amount {
            self.visual_position = self.target_position;
            self.at_grid_position = true;

            if let Some(new_dir) = self.next_direction.take() {
                self.direction = new_dir;
            }

            self.grid_position.0 += self.direction.0;
            self.grid_position.1 += self.direction.1;

            self.target_position = (
                (self.grid_position.0 as f64 + 0.5) * self.grid_size as f64,
                (self.grid_position.1 as f64 + 0.5) * self.grid_size as f64,
            );

            if self.is_out_of_bounds() {
                on_game_over();
            }

            self.at_grid_position = false;
        } else {
            let step_x = if dx != 0.0 {
                dx.signum() * move_amount
            } else {
                0.0
            };
            let step_y = if dy != 0.0 {
                dy.signum() * move_amount
            } else {
                0.0
            };

            self.visual_position.0 += step_x;
            self.visual_position.1 += step_y;
        }
    }

    fn is_out_of_bounds(&self) -> bool {
        self.grid_position.0 < 0
            || self.grid_position.0 >= 30
            || self.grid_position.1 < 0
            || self.grid_position.1 >= 20
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec<f64> {
        vec![self.visual_position.0, self.visual_position.1]
    }

    #[wasm_bindgen(getter)]
    pub fn direction(&self) -> Vec<i32> {
        vec![self.direction.0, self.direction.1]
    }
}
