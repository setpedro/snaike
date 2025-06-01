use crate::game::snake::{
    core::SnakeCore, direction_handler::handle_direction, human::input::InputState,
};
use wasm_bindgen::prelude::wasm_bindgen;

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
            core: SnakeCore::new(5, 5, 1, 0, 7.0), // Start at (5, 5), move right (-1, 0), speed of 6.0
            input_state: InputState::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        let pressed = self.input_state.pressed;

        if pressed != 0 {
            handle_direction(&mut self.core, pressed);
        }

        self.core.update_movement(delta_time);
    }
}
