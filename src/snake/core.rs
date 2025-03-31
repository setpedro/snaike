use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SnakeCore {
    grid_position: Vec2,
    visual_position: (f64, f64),
    pub(crate) direction: Vec2,
    pub next_direction: Option<Vec2>,
    speed: f64,
    grid_size: i32,
    target_position: (f64, f64),
    #[wasm_bindgen(readonly)]
    pub at_grid_position: bool,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq)]
pub struct Vec2 {
    pub x: i32,
    pub y: i32,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "onGameOver")]
    pub fn on_game_over();
}

#[wasm_bindgen]
impl SnakeCore {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let grid_pos = Vec2 { x: 10, y: 10 };
        let grid_size = 20;
        let pixel_x = (grid_pos.x as f64 + 0.5) * grid_size as f64;
        let pixel_y = (grid_pos.y as f64 + 0.5) * grid_size as f64;

        Self {
            grid_position: grid_pos,
            visual_position: (pixel_x, pixel_y),
            direction: Vec2 { x: 1, y: 0 },
            next_direction: None,
            speed: 7.5,
            grid_size,
            target_position: (pixel_x, pixel_y),
            at_grid_position: true,
        }
    }

    #[wasm_bindgen]
    pub fn update_movement(&mut self, delta_time: f64) {
        let move_amount = self.speed * self.grid_size as f64 * delta_time;
        let dx = self.target_position.0 - self.visual_position.0;
        let dy = self.target_position.1 - self.visual_position.1;
        let distance = dx.abs().max(dy.abs());

        if distance <= move_amount {
            self.grid_position.x += self.direction.x;
            self.grid_position.y += self.direction.y;

            self.target_position = (
                (self.grid_position.x as f64 + 0.5) * self.grid_size as f64,
                (self.grid_position.y as f64 + 0.5) * self.grid_size as f64,
            );
            self.grid_position.x += self.direction.x;
            self.grid_position.y += self.direction.y;

            self.target_position = (
                (self.grid_position.x as f64 + 0.5) * self.grid_size as f64,
                (self.grid_position.y as f64 + 0.5) * self.grid_size as f64,
            );

            if self.is_out_of_bounds() {
                on_game_over();
            }

            self.at_grid_position = false;
        } else {
            let step_x = if dx != 0.0 {
                dx.signum() * move_amount
            } else {
                0.0
            };
            let step_y = if dy != 0.0 {
                dy.signum() * move_amount
            } else {
                0.0
            };

            self.visual_position.0 += step_x;
            self.visual_position.1 += step_y;
        }
    }

    fn is_out_of_bounds(&self) -> bool {
        self.grid_position.x < 0
            || self.grid_position.x >= 30
            || self.grid_position.y < 0
            || self.grid_position.y >= 20
    }

    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Vec<f64> {
        vec![self.visual_position.0, self.visual_position.1]
    }

    #[wasm_bindgen(getter)]
    pub fn direction(&self) -> Vec<i32> {
        vec![self.direction.x, self.direction.y]
    }
}
