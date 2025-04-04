use crate::game::constants;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct GridConstants {
    #[wasm_bindgen(readonly)]
    pub cols: i32,

    #[wasm_bindgen(readonly)]
    pub rows: i32,

    #[wasm_bindgen(readonly, js_name = cellSizePx)]
    pub cell_size_px: i32,
}

#[wasm_bindgen(js_name = getGridConstants)]
pub fn get_grid_constants() -> GridConstants {
    GridConstants {
        cols: constants::GRID_COLS,
        rows: constants::GRID_ROWS,
        cell_size_px: constants::CELL_SIZE_PX,
    }
}
