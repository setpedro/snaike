use wasm_bindgen::prelude::wasm_bindgen;

use crate::game::snake::{core::SnakeCore, human::input::InputState};

#[wasm_bindgen]
pub struct HumanSnake {
    pub(crate) core: SnakeCore,
    pub(crate) input_state: InputState,
}

#[wasm_bindgen]
impl HumanSnake {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            core: SnakeCore::new(),
            input_state: InputState::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        let pressed = self.input_state.pressed;

        if pressed != 0 {
            self.process_input(pressed);
        }

        self.core.update_movement(delta_time);
    }

    fn process_input(&mut self, pressed: u8) {
        let new_dir = match () {
            _ if pressed & 0b0001 != 0 => (0, -1),               // Up
            _ if pressed & 0b1000 != 0 => (1, 0),                // Right
            _ if pressed & 0b0100 != 0 => (0, 1),                // Down
            _ if pressed & 0b0010 != 0 => (-1, 0),               // Left
            _ => (self.core.direction.0, self.core.direction.1), // Fallback
        };

        if self.is_valid_direction(new_dir) {
            self.core.next_direction = Some(new_dir);
        }
    }

    fn is_valid_direction(&self, dir: (i32, i32)) -> bool {
        dir != self.core.direction
            && !(dir.0 == -self.core.direction.0 && dir.1 == -self.core.direction.1)
    }
}
