const X_START: i32 = 10;
const Y_START: i32 = 10;
const DX_START: i32 = -1;
const DY_START: i32 = 0;
const SPEED: f64 = 3.0;

use crate::game::{
    constants::CELL_SIZE_PX,
    snake::{ai::decision::DecisionState, core::SnakeCore, direction_handler::handle_direction},
};

pub struct AISnake {
    pub(crate) core: SnakeCore,
    pub(crate) decision_state: DecisionState,
}

impl AISnake {
    pub fn new() -> Self {
        Self {
            core: SnakeCore::new(X_START, Y_START, DX_START, DY_START, SPEED),
            decision_state: DecisionState::new(),
        }
    }

    pub fn update(&mut self, delta_time: f64, food: (i32, i32)) {
        let head_position = self.core.position();

        let is_at_node = ((head_position[0] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64)
            .abs()
            < f64::EPSILON
            && ((head_position[1] - (CELL_SIZE_PX / 2) as f64) % CELL_SIZE_PX as f64).abs()
                < f64::EPSILON;

        if is_at_node {
            self.decision_state
                .set_decision(food, self.core.head_grid_position, &self.core);

            let decided = self.decision_state.decided;
            if decided != 0 {
                handle_direction(&mut self.core, decided);
            }
        }

        self.core.update_movement(delta_time);
    }
}
