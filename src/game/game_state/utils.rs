use crate::{
    game::constants::{CELL_SIZE_PX, GRID_COLS, GRID_ROWS},
    SnakeCore,
};

pub fn is_at_node(head: &[f64]) -> bool {
    ((head[0] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs() < f64::EPSILON
        && ((head[1] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs() < f64::EPSILON
}

pub fn is_out_of_bounds(snake: &SnakeCore) -> bool {
    snake.head_grid_position.0 < 0
        || snake.head_grid_position.0 >= GRID_COLS
        || snake.head_grid_position.1 < 0
        || snake.head_grid_position.1 >= GRID_ROWS
}
