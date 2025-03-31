use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct GameState {
    food: (i32, i32),
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { food: (0, 0) }
    }

    #[wasm_bindgen]
    pub fn get_food(&mut self) -> Vec<i32> {
        let x = thread_rng().gen_range(1..30) * 20 + 10;
        let y = thread_rng().gen_range(1..20) * 20 + 10;

        self.food = (x, y);

        vec![x, y]
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.food.0, self.food.1]
    }
}
