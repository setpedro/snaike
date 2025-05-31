use std::collections::VecDeque;

use wasm_bindgen::prelude::*;

use crate::game::constants::CELL_SIZE_PX;

#[wasm_bindgen]
pub struct SnakeCore {
    pub(crate) grid_position: (i32, i32),
    visual_position: (f64, f64),
    pub(crate) direction: (i32, i32),
    pub(crate) next_direction: Option<(i32, i32)>,
    speed: f64,
    grid_size: i32,
    target_position: (f64, f64),
    pub(crate) at_grid_position: bool,
    pub(crate) path_history: VecDeque<PathEntry>,
    pub(crate) body_segments: Vec<BodySegment>,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct PathEntry {
    pub(crate) grid_position: (i32, i32),
    start_visual: (f64, f64),
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct BodySegment {
    current_pos: (f64, f64),
    offset: usize, // Steps behind head (1 for first segment, 2 for second, etc)
    progress: f64,
}

#[wasm_bindgen]
impl SnakeCore {
    #[wasm_bindgen(constructor)]
    pub fn new(pos_x: i32, pos_y: i32, dir_x: i32, dir_y: i32, speed: f64) -> Self {
        let grid_pos = (pos_x, pos_y);
        let direction = (dir_x, dir_y);
        let grid_size = CELL_SIZE_PX;
        let pixel_x = (grid_pos.0 as f64 + 0.5) * grid_size as f64;
        let pixel_y = (grid_pos.1 as f64 + 0.5) * grid_size as f64;

        Self {
            grid_position: grid_pos,
            visual_position: (pixel_x, pixel_y),
            direction,
            next_direction: None,
            speed, // avoid: 1,2,4,5 due to visual bug
            grid_size,
            target_position: (pixel_x, pixel_y),
            at_grid_position: true,
            path_history: VecDeque::new(),
            body_segments: Vec::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update_movement(&mut self, delta_time: f64) {
        let move_amount = self.speed * self.grid_size as f64 * delta_time;
        let dx = self.target_position.0 - self.visual_position.0;
        let dy = self.target_position.1 - self.visual_position.1;
        let distance = dx.abs().max(dy.abs());

        if distance <= move_amount {
            self.visual_position = self.target_position;
            self.at_grid_position = true;

            // Record path history when entering new cell
            self.path_history.push_back(PathEntry {
                grid_position: self.grid_position,
                start_visual: self.visual_position,
            });

            let max_offset = self
                .body_segments
                .iter()
                .map(|s| s.offset)
                .max()
                .unwrap_or(0);
            let keep_entries = max_offset + 1;
            while self.path_history.len() > keep_entries {
                self.path_history.pop_front();
            }

            if let Some(new_dir) = self.next_direction.take() {
                self.direction = new_dir;
            }

            self.grid_position.0 += self.direction.0;
            self.grid_position.1 += self.direction.1;
            self.target_position = (
                (self.grid_position.0 as f64 + 0.5) * self.grid_size as f64,
                (self.grid_position.1 as f64 + 0.5) * self.grid_size as f64,
            );

            self.at_grid_position = false;
        } else {
            // direction * if there's movement: (true -> 1.0, false -> 0.0) * move amount
            let step_x = dx.signum() * (dx.abs() > 0.0) as i32 as f64 * move_amount;
            let step_y = dy.signum() * (dy.abs() > 0.0) as i32 as f64 * move_amount;

            self.visual_position.0 += step_x;
            self.visual_position.1 += step_y;
        }

        for segment in &mut self.body_segments {
            let history_len = self.path_history.len();

            // Calculate position in history relative to END
            let target_idx = history_len
                .checked_sub(segment.offset)
                .filter(|&v| v > 0)
                .unwrap_or(0);

            let Some(target_entry) = self.path_history.get(target_idx.saturating_sub(1)) else {
                continue;
            };

            let Some(next_entry) = self.path_history.get(target_idx) else {
                continue;
            };

            let step = self.speed * delta_time;
            segment.progress += step;

            if segment.progress >= 1.0 {
                segment.current_pos = (
                    (target_entry.grid_position.0 as f64 + 0.5) * self.grid_size as f64,
                    (target_entry.grid_position.1 as f64 + 0.5) * self.grid_size as f64,
                );
                segment.progress = 0.0;
            } else {
                segment.current_pos.0 = target_entry.start_visual.0
                    + (next_entry.start_visual.0 - target_entry.start_visual.0) * segment.progress;
                segment.current_pos.1 = target_entry.start_visual.1
                    + (next_entry.start_visual.1 - target_entry.start_visual.1) * segment.progress;
            }
        }
    }

    #[wasm_bindgen]
    pub fn grow(&mut self) {
        let new_offset = self.body_segments.len() + 1;
        self.body_segments.push(BodySegment {
            current_pos: self.visual_position,
            offset: new_offset,
            progress: 0.0,
        });
    }

    #[wasm_bindgen]
    pub fn get_body_positions(&self) -> Vec<f64> {
        self.body_segments
            .iter()
            .flat_map(|s| vec![s.current_pos.0, s.current_pos.1])
            .collect()
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec<f64> {
        vec![self.visual_position.0, self.visual_position.1]
    }

    #[wasm_bindgen(getter)]
    pub fn check_self_collision(&self) -> bool {
        let head_grid_pos = self.grid_position;

        // Check if head's grid position matches any body segment's grid position
        for entry in &self.path_history {
            if entry.grid_position == head_grid_pos {
                return true;
            }
        }
        false
    }

    #[wasm_bindgen(getter)]
    pub fn direction(&self) -> Vec<i32> {
        vec![self.direction.0, self.direction.1]
    }
}
