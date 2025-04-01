use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::snake::human::human::HumanSnake;

#[wasm_bindgen]
pub struct GameState {
    pub(crate) human: HumanSnake, // PROBLEM HERE, I CAN'T ACCESS IN THE JS LIKE: new InputHandler(this, this.gameState.human); "Property 'human' does not exist on type 'GameState'."
    food: (i32, i32),
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            food: (0, 0),
            human: HumanSnake::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.human.update(delta_time);

        // TODO: collision / food checks...
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

    #[wasm_bindgen]
    pub fn get_snake_position(&self) -> Vec<f64> {
        self.human.core.position()
    }

    #[wasm_bindgen]
    pub fn get_snake_direction(&self) -> Vec<i32> {
        self.human.core.direction()
    }

    #[wasm_bindgen]
    pub fn set_input_key(&mut self, key: char, is_pressed: bool) {
        self.human.input_state.set_key(key, is_pressed);
    }
}
