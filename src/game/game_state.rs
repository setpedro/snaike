use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{game::enums::Collision, game::snake::human::human::HumanSnake};

#[wasm_bindgen]
pub struct GameState {
    pub(crate) human: HumanSnake,
    food: (i32, i32),
}

#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            food: (0, 0),
            human: HumanSnake::new(),
        }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.human.update(delta_time);

        let head_position = self.human.core.position();
        let at_grid_position = ((head_position[0] - 10.0) % 20.0).abs() < f64::EPSILON
            && ((head_position[1] - 10.0) % 20.0).abs() < f64::EPSILON;

        if at_grid_position {
            let head_at_grid_position = (head_position[0] as i32, head_position[1] as i32);

            let collision: Option<Collision> = match () {
                _ if head_at_grid_position == self.food => Some(Collision::Food),
                _ => None,
            };

            if let Some(collision_type) = collision {
                self.handle_collision(collision_type);
            }
        }
    }

    fn handle_collision(&self, collision: Collision) {
        web_sys::console::log_1(&format!("Collision detected: {:?}", collision).into());
    }

    #[wasm_bindgen]
    pub fn get_food(&mut self) -> Vec<i32> {
        let x = thread_rng().gen_range(1..30) * 20 + 10;
        let y = thread_rng().gen_range(1..20) * 20 + 10;

        self.food = (x, y);

        vec![x, y]
    }

    #[wasm_bindgen(getter)]
    pub fn food(&self) -> Vec<i32> {
        vec![self.food.0, self.food.1]
    }

    #[wasm_bindgen]
    pub fn get_snake_position(&self) -> Vec<f64> {
        self.human.core.position()
    }

    #[wasm_bindgen]
    pub fn get_snake_direction(&self) -> Vec<i32> {
        self.human.core.direction()
    }

    #[wasm_bindgen]
    pub fn set_input_key(&mut self, key: char, is_pressed: bool) {
        self.human.input_state.set_key(key, is_pressed);
    }
}
