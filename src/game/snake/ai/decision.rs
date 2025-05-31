use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct DecisionState {
    pub decided: u8, // Bitmask: 0b0001=Up, 0b0010=Left, 0b0100=Down, 0b1000=Right
}

#[wasm_bindgen]
impl DecisionState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { decided: 0 }
    }

    #[wasm_bindgen]
    pub fn set_decision(&mut self) {
        let moves = [0b0001, 0b0010, 0b0100, 0b1000];
        self.decided = moves[thread_rng().gen_range(0..moves.len())]; // randomize for now
    }
}
