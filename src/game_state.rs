use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::snake::{core::Vec2, human::human::HumanSnake};

#[wasm_bindgen]
pub struct GameState {
    #[wasm_bindgen(skip)]
    pub human: HumanSnake, // PROBLEM HERE, I CAN'T ACCESS IN THE JS LIKE: new InputHandler(this, this.gameState.human); "Property 'human' does not exist on type 'GameState'."
    pub(crate) food: Vec2,
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            food: Vec2 { x: 0, y: 0 },
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

        self.food = Vec2 { x, y };

        vec![x, y]
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.food.x, self.food.y]
    }
}
