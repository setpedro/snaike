use crate::game::game_state::{callbacks::on_game_win, common::GameStateCommon, utils::is_at_node};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SoloGameState {
    common: GameStateCommon,
}

impl_game_state_api!(SoloGameState);

#[wasm_bindgen]
impl SoloGameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut common = GameStateCommon::new();
        common.regenerate_food(None);
        Self { common }
    }

    #[wasm_bindgen]
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
}
