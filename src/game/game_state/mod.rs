#[macro_export]
macro_rules! impl_game_state_api {
    ($type:ident) => {
        #[wasm_bindgen]
        impl $type {
            #[wasm_bindgen(getter)]
            pub fn food(&self) -> Vec<i32> {
                self.common.food()
            }

            #[wasm_bindgen]
            pub fn get_human_snake_position(&self) -> Vec<f64> {
                self.common.get_human_snake_position()
            }

            #[wasm_bindgen]
            pub fn get_human_snake_body_positions(&self) -> Vec<f64> {
                self.common.get_human_snake_body_positions()
            }

            #[wasm_bindgen]
            pub fn set_input_key(&mut self, key: &str, is_pressed: bool) {
                self.common.set_input_key(key, is_pressed)
            }
        }
    };
}

mod callbacks;
mod common;
pub mod solo;
mod utils;
pub mod versus;
