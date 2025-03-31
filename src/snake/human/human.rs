use wasm_bindgen::prelude::wasm_bindgen;

use crate::snake::{
    core::{SnakeCore, Vec2},
    human::input::InputState,
};

#[wasm_bindgen]
pub struct HumanSnake {
    core: SnakeCore,
    input_state: InputState,
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
        self.process_input();
        self.core.update_movement(delta_time);
    }

    fn process_input(&mut self) {
        let pressed = self.input_state.pressed;
        let new_dir: Vec2 = match () {
            _ if pressed & 0b0001 != 0 => Vec2 { x: 0, y: -1 }, // Up
            _ if pressed & 0b1000 != 0 => Vec2 { x: 1, y: 0 },  // Right
            _ if pressed & 0b0100 != 0 => Vec2 { x: 0, y: 1 },  // Down
            _ if pressed & 0b0010 != 0 => Vec2 { x: -1, y: 0 }, // Left
            _ => Vec2 {
                x: self.core.direction.x,
                y: self.core.direction.y,
            }, // Fallback
        };

        if self.is_valid_direction(new_dir) {
            self.core.next_direction = Some(new_dir);
        }
    }

    fn is_valid_direction(&self, dir: Vec2) -> bool {
        dir != self.core.direction
            && !(dir.x == -self.core.direction.x && dir.y == -self.core.direction.y)
    }
}
