use crate::game::constants::{DOWN, LEFT, RIGHT, UP};
use crate::game::snake::core::SnakeCore;

pub struct DecisionState {
    pub decided: u8,
    last_food_position: (i32, i32),
    // New state for movement phases
    move_phase: MovePhase,
    target_x: i32,
    target_y: i32,
}

// Tracks current movement phase
enum MovePhase {
    Horizontal,
    Vertical,
}

impl DecisionState {
    pub fn new() -> Self {
        Self {
            decided: 0,
            last_food_position: (-1, -1),
            move_phase: MovePhase::Horizontal,
            target_x: 0,
            target_y: 0,
        }
    }

    pub fn set_decision(&mut self, food: (i32, i32), position: (i32, i32), snake_core: &SnakeCore) {
        // Convert food to grid coordinates
        let food_grid = (
            food.0 / crate::game::constants::CELL_SIZE_PX,
            food.1 / crate::game::constants::CELL_SIZE_PX,
        );

        let ai_pos = position;
        let current_dir = snake_core.direction();
        let current_direction = (current_dir[0], current_dir[1]);

        // Reset movement plan if food changed
        if food_grid != self.last_food_position {
            self.move_phase = MovePhase::Horizontal;
            self.target_x = food_grid.0;
            self.target_y = food_grid.1;
            self.last_food_position = food_grid;
        }

        // Phase-based movement decision
        let desired_direction = match self.move_phase {
            MovePhase::Horizontal => {
                if ai_pos.0 == self.target_x {
                    self.move_phase = MovePhase::Vertical;
                    // Move vertically after reaching target x
                    if ai_pos.1 < self.target_y {
                        (0, 1)
                    } else {
                        (0, -1)
                    }
                } else {
                    // Continue moving horizontally
                    if ai_pos.0 < self.target_x {
                        (1, 0)
                    } else {
                        (-1, 0)
                    }
                }
            }
            MovePhase::Vertical => {
                if ai_pos.1 == self.target_y {
                    self.move_phase = MovePhase::Horizontal;
                    // Move horizontally after reaching target y
                    if ai_pos.0 < self.target_x {
                        (1, 0)
                    } else {
                        (-1, 0)
                    }
                } else {
                    // Continue moving vertically
                    if ai_pos.1 < self.target_y {
                        (0, 1)
                    } else {
                        (0, -1)
                    }
                }
            }
        };

        // Convert direction to move constant
        let desired_move = match desired_direction {
            (0, -1) => UP,
            (-1, 0) => LEFT,
            (0, 1) => DOWN,
            (1, 0) => RIGHT,
            _ => match current_direction {
                (0, -1) => UP,
                (-1, 0) => LEFT,
                (0, 1) => DOWN,
                (1, 0) => RIGHT,
                _ => RIGHT,
            },
        };

        // Calculate next position for collision check
        let next_pos = match desired_direction {
            (0, -1) => (ai_pos.0, ai_pos.1 - 1), // UP
            (-1, 0) => (ai_pos.0 - 1, ai_pos.1), // LEFT
            (0, 1) => (ai_pos.0, ai_pos.1 + 1),  // DOWN
            (1, 0) => (ai_pos.0 + 1, ai_pos.1),  // RIGHT
            _ => ai_pos,
        };

        // Check wall collisions only (remove human snake collision)
        let would_hit_wall = next_pos.0 < 0
            || next_pos.0 >= crate::game::constants::GRID_COLS
            || next_pos.1 < 0
            || next_pos.1 >= crate::game::constants::GRID_ROWS;

        // Check self collisions
        let would_hit_self = snake_core
            .path_history
            .iter()
            .any(|entry| entry.grid_position == next_pos);

        if would_hit_wall || would_hit_self {
            // Try safe fallback directions
            let alternatives = [
                ((0, -1), UP),   // UP
                ((-1, 0), LEFT), // LEFT
                ((0, 1), DOWN),  // DOWN
                ((1, 0), RIGHT), // RIGHT
            ];

            for (dir, move_const) in alternatives.iter() {
                if *dir == (-current_direction.0, -current_direction.1) {
                    continue; // Skip reverse direction
                }

                let test_pos = (ai_pos.0 + dir.0, ai_pos.1 + dir.1);
                let hit_wall = test_pos.0 < 0
                    || test_pos.0 >= crate::game::constants::GRID_COLS
                    || test_pos.1 < 0
                    || test_pos.1 >= crate::game::constants::GRID_ROWS;

                let hit_self = snake_core
                    .path_history
                    .iter()
                    .any(|entry| entry.grid_position == test_pos);

                if !hit_wall && !hit_self {
                    self.decided = *move_const;
                    return;
                }
            }

            // Default to current direction if all alternatives fail
            self.decided = match current_direction {
                (0, -1) => UP,
                (-1, 0) => LEFT,
                (0, 1) => DOWN,
                (1, 0) => RIGHT,
                _ => RIGHT,
            };
        } else {
            self.decided = desired_move;
        }
    }
}
