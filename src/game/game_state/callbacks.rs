use crate::game::enums::GameEndCause;
use wasm_bindgen::prelude::wasm_bindgen;

pub fn game_end(cause: GameEndCause) {
    on_game_end(cause.to_string());
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameEnd")]
    fn on_game_end(cause: &str);
    #[wasm_bindgen(js_name = "onScoreUpdate")]
    pub fn on_score_update(new_score: i32);
}
