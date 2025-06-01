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
            core: SnakeCore::new(10, 10, -1, 0, 6.0), // Start at (10,10), move left (-1, 0), speed of 5.0
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
