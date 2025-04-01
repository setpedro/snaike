use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct InputState {
    pub pressed: u8, // Bitmask: 0b0001=Up, 0b0010=Left, 0b0100=Down, 0b1000=Right
}

#[wasm_bindgen]
impl InputState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { pressed: 0 }
    }

    #[wasm_bindgen]
    pub fn set_key(&mut self, key: char, is_pressed: bool) {
        let bit = match key.to_ascii_lowercase() {
            'w' => 0b0001,
            'a' => 0b0010,
            's' => 0b0100,
            'd' => 0b1000,
            _ => return,
        };
        self.pressed = if is_pressed {
            self.pressed | bit
        } else {
            self.pressed & !bit
        };
    }

    #[wasm_bindgen]
    pub fn get_key(&mut self, key: char, is_pressed: bool) {
        self.set_key(key, is_pressed);
    }
}
