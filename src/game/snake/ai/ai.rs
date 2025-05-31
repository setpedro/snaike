use crate::game::snake::{ai::decision::DecisionState, core::SnakeCore};

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
            self.process_input(decided);
        }

        self.core.update_movement(delta_time);
    }

    // TODO: reuse code of human.rs (abstract it)
    fn process_input(&mut self, input: u8) {
        let new_dir = match () {
            _ if input & 0b0001 != 0 => (0, -1),                 // Up
            _ if input & 0b1000 != 0 => (1, 0),                  // Right
            _ if input & 0b0100 != 0 => (0, 1),                  // Down
            _ if input & 0b0010 != 0 => (-1, 0),                 // Left
            _ => (self.core.direction.0, self.core.direction.1), // Fallback
        };

        if self.is_valid_direction(new_dir) {
            self.core.next_direction = Some(new_dir);
        }
    }

    fn is_valid_direction(&self, dir: (i32, i32)) -> bool {
        dir != self.core.direction
            && !(dir.0 == -self.core.direction.0 && dir.1 == -self.core.direction.1)
    }
}
