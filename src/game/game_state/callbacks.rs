use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
    #[wasm_bindgen(js_name = "onGameWin")]
    pub fn on_game_win();
    #[wasm_bindgen(js_name = "onGameDraw")]
    pub fn on_game_draw();
    #[wasm_bindgen(js_name = "onScoreUpdate")]
    pub fn on_score_update(new_score: i32);
}
