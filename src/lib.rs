use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Rectangle {
    position: (u32, u32),
    direction: (i32, i32),
    speed: u32, // in milliseconds
}

#[wasm_bindgen]
impl Rectangle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            position: (210, 210),
            direction: (1, 0),
            speed: 100,
        }
    }

    #[wasm_bindgen]
    pub fn move_snake(&mut self, input: char) {
        self.direction = match input.to_ascii_lowercase() {
            'w' => (0, -1),
            'a' => (-1, 0),
            's' => (0, 1),
            'd' => (1, 0),
            _ => self.direction
        };
    }

    #[wasm_bindgen]
    pub fn update_position(&mut self, x: u32, y: u32) {
        self.position = (x, y);
    }

    #[wasm_bindgen]
    pub fn position(&self) -> Vec<u32> {
        vec![self.position.0, self.position.1]
    }
    

    #[wasm_bindgen]
    pub fn direction(&self) -> Vec<i32> {
        vec![self.direction.0, self.direction.1]
    }
}
