use wasm_bindgen::prelude::wasm_bindgen;

use crate::game::constants::{DOWN, LEFT, RIGHT, UP};

#[wasm_bindgen]
pub struct InputState {
    pub pressed: u8,
}

#[wasm_bindgen]
impl InputState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { pressed: 0 }
    }

    #[wasm_bindgen]
    pub fn set_key(&mut self, key: &str, is_pressed: bool) {
        let bit = match key.to_lowercase().as_str() {
            "w" | "arrowup" => UP,
            "a" | "arrowleft" => LEFT,
            "s" | "arrowdown" => DOWN,
            "d" | "arrowright" => RIGHT,
            _ => return,
        };
        self.pressed = if is_pressed {
            self.pressed | bit
        } else {
            self.pressed & !bit
        };
    }
}
