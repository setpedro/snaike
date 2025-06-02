const X_START: i32 = 10;
const Y_START: i32 = 10;
const DX_START: i32 = -1;
const DY_START: i32 = 0;
const SPEED: f64 = 6.0;

use crate::game::snake::{
    ai::decision::DecisionState, core::SnakeCore, direction_handler::handle_direction,
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

    pub fn update(&mut self, delta_time: f64) {
        // simply call at every iteration for now
        self.decision_state.set_decision();
        let decided = self.decision_state.decided;

        if decided != 0 {
            handle_direction(&mut self.core, decided);
        }

        self.core.update_movement(delta_time);
    }
}
