use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Rectangle {
    grid_position: (i32, i32),
    visual_position: (f64, f64),
    direction: (i32, i32),
    next_direction: Option<(i32, i32)>,
    speed: f64,
    grid_size: i32,
    target_position: (f64, f64),
    at_grid_position: bool,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
}

#[wasm_bindgen]
impl Rectangle {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let grid_pos = (10, 10);
        let grid_size = 20;
        let pixel_x = (grid_pos.0 as f64 + 0.5) * grid_size as f64;
        let pixel_y = (grid_pos.1 as f64 + 0.5) * grid_size as f64;

        Self {
            grid_position: grid_pos,
            visual_position: (pixel_x, pixel_y),
            target_position: (pixel_x, pixel_y),
            direction: (1, 0),
            next_direction: None,
            speed: 8.0,
            grid_size,
            at_grid_position: true,
        }
    }

    #[wasm_bindgen]
    pub fn move_snake(&mut self, input: char) {
        let new_dir = match input.to_ascii_lowercase() {
            'w' => (0, -1),
            'a' => (-1, 0),
            's' => (0, 1),
            'd' => (1, 0),
            _ => return,
        };

        if (new_dir.0 == -self.direction.0 && new_dir.1 == -self.direction.1)
            || new_dir == self.direction
        {
            return;
        }

        self.next_direction = Some(new_dir);
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        let move_amount = self.speed * self.grid_size as f64 * delta_time;
        let dx = self.target_position.0 - self.visual_position.0;
        let dy = self.target_position.1 - self.visual_position.1;
        let distance = (dx * dx + dy * dy).sqrt();

        if distance <= move_amount {
            self.visual_position = self.target_position;
            self.at_grid_position = true;

            if let Some(new_dir) = self.next_direction.take() {
                self.direction = new_dir;
            }

            self.grid_position.0 += self.direction.0;
            self.grid_position.1 += self.direction.1;

            self.target_position = (
                (self.grid_position.0 as f64 + 0.5) * self.grid_size as f64,
                (self.grid_position.1 as f64 + 0.5) * self.grid_size as f64,
            );

            if self.is_out_of_bounds() {
                on_game_over();
            }

            self.at_grid_position = false;
        } else {
            let ratio = move_amount / distance;
            self.visual_position.0 += dx * ratio;
            self.visual_position.1 += dy * ratio;
        }
    }

    fn is_out_of_bounds(&self) -> bool {
        self.grid_position.0 < 0
            || self.grid_position.0 >= 30
            || self.grid_position.1 < 0
            || self.grid_position.1 >= 20
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec<f64> {
        vec![self.visual_position.0, self.visual_position.1]
    }

    #[wasm_bindgen(getter)]
    pub fn direction(&self) -> Vec<i32> {
        vec![self.direction.0, self.direction.1]
    }
}
