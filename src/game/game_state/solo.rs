use crate::game::game_state::{callbacks::on_game_win, utils::is_at_node};

use super::common::GameStateCommon;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SoloGameState {
    common: GameStateCommon,
}

#[wasm_bindgen]
impl SoloGameState {
    pub fn new() -> Self {
        let mut common = GameStateCommon::new();
        common.regenerate_food(None);
        Self { common }
    }

    pub fn update(&mut self, delta_time: f64) {
        self.common.human.update(delta_time);

        let human_head_position = self.common.human.core.get_head_pixel_position();
        let human_head_pixel_position =
            (human_head_position[0] as i32, human_head_position[1] as i32);

        if is_at_node(&human_head_position) {
            // Grow 3 segments when the game starts
            if self.common.human.core.grow_counter > 0 && self.common.human.core.direction != (0, 0)
            {
                self.common.human.core.grow();
                self.common.human.core.grow_counter -= 1;
            }

            if let Some(collision) = self
                .common
                .check_static_collision(&self.common.human.core, human_head_pixel_position)
            {
                if self.common.is_win(None) {
                    on_game_win();
                    return;
                }
                self.common.handle_human_collision(collision);
                return;
            }
        }
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.common.food.0, self.common.food.1]
    }

    #[wasm_bindgen]
    pub fn get_human_snake_position(&self) -> Vec<f64> {
        self.common.human.core.get_head_pixel_position()
    }

    #[wasm_bindgen]
    pub fn get_human_snake_body_positions(&self) -> Vec<f64> {
        self.common.human.core.get_body_positions()
    }

    #[wasm_bindgen]
    pub fn set_input_key(&mut self, key: &str, is_pressed: bool) {
        self.common.human.input_state.set_key(key, is_pressed);
    }
}
