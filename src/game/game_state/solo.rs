use crate::game::constants::CELL_SIZE_PX;
use crate::game::enums::{GameEndCause, Winner};
use crate::{
    game::game_state::{callbacks::game_end, common::GameStateCommon, utils::is_at_node},
    grid_to_pixel_position,
};

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
        common.food = grid_to_pixel_position!((10, 5), i32);
        Self { common }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64, current_time: f64) {
        self.common.check_and_start_timer(current_time);

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
                if let Winner::Human = self.common.check_winner(None) {
                    game_end(GameEndCause::Filled);
                }

                self.common.handle_human_collision(collision, current_time);
                return;
            }
        }
    }
}
