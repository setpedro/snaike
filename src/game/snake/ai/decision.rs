use crate::game::constants::{DOWN, LEFT, RIGHT, UP};

use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct DecisionState {
    pub decided: u8,
}

#[wasm_bindgen]
impl DecisionState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { decided: 0 }
    }

    #[wasm_bindgen]
    pub fn set_decision(&mut self) {
        let moves = [UP, LEFT, DOWN, RIGHT];
        self.decided = moves[thread_rng().gen_range(0..moves.len())]; // randomize for now
    }
}
