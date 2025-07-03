use crate::{
    game::{
        constants::CELL_SIZE_PX,
        enums::Collision,
        game_state::{
            callbacks::{on_game_draw, on_game_over, on_game_win},
            common::GameStateCommon,
            utils::is_at_node,
        },
        snake::ai::ai::AISnake,
    },
    grid_to_pixel_position,
};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct VersusGameState {
    common: GameStateCommon,
    ai: AISnake,
}

impl_game_state_api!(VersusGameState);

#[wasm_bindgen]
impl VersusGameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut common = GameStateCommon::new();
        let mut ai = AISnake::new();
        ai.core.grow_counter = 3;

        common.regenerate_food(Some(&ai));
        Self { common, ai }
    }

    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) {
        self.common.human.update(delta_time);
        self.ai.update(delta_time, self.common.food);

        let human_head_position = self.common.human.core.get_head_pixel_position();
        let ai_head_position = self.ai.core.get_head_pixel_position();

        let human_head_pixel_position =
            (human_head_position[0] as i32, human_head_position[1] as i32);
        let ai_head_pixel_position = (ai_head_position[0] as i32, ai_head_position[1] as i32);

        if let Some(collision) =
            self.check_head_to_head_collision(human_head_pixel_position, ai_head_pixel_position)
        {
            self.handle_snake_collision(collision);
            return;
        }

        // Check body collisions continuously (but using grid positions)
        if let Some(collision) = self.check_human_ai_body_collision_grid() {
            self.handle_snake_collision(collision);
            return;
        }

        if let Some(collision) = self.check_ai_human_body_collision_grid() {
            self.handle_snake_collision(collision);
            return;
        }

        if is_at_node(&human_head_position) {
            // Grow 3 segments when the game starts
            if self.common.human.core.grow_counter > 0 && self.common.human.core.direction != (0, 0)
            {
                self.common.human.core.grow();
                self.common.human.core.grow_counter -= 1;
            }

            if let Some(collision) = self
                .common
                .check_static_collision(&self.common.human.core, human_head_pixel_position)
            {
                if self.common.is_win(Some(&self.ai)) {
                    on_game_win();
                    return;
                }
                self.common.handle_human_collision(collision);
                return;
            }
        }

        if is_at_node(&ai_head_position) {
            // Grow 3 segments when the game starts
            if self.ai.core.grow_counter > 0 && self.ai.core.direction != (0, 0) {
                self.ai.core.grow();
                self.ai.core.grow_counter -= 1;
            }

            if let Some(collision) = self
                .common
                .check_static_collision(&self.ai.core, ai_head_pixel_position)
            {
                self.handle_ai_collision(collision);
                return;
            }
        }
    }

    fn handle_ai_collision(&mut self, collision: Collision) {
        match collision {
            Collision::Wall | Collision::OwnBody => on_game_win(),
            Collision::Food => {
                self.ai.core.grow();
                self.common.regenerate_food(Some(&self.ai));
            }
            _ => unreachable!(),
        }
    }

    fn handle_snake_collision(&mut self, collision: Collision) {
        match collision {
            Collision::HumanHeadToAiHead => on_game_over(),
            Collision::AiHeadToHumanHead => on_game_win(),
            Collision::HumanHeadToAiBody => on_game_over(),
            Collision::AiHeadToHumanBody => on_game_win(),
            Collision::HeadSwap => on_game_draw(),
            _ => unreachable!(),
        }
    }

    fn check_human_ai_body_collision_grid(&self) -> Option<Collision> {
        let human_snake_head_position = self.common.human.core.head_grid_position;

        for entry in &self.ai.core.path_history {
            if entry.grid_position == human_snake_head_position {
                return Some(Collision::HumanHeadToAiBody);
            }
        }
        None
    }

    fn check_ai_human_body_collision_grid(&self) -> Option<Collision> {
        let ai_snake_head_position = self.ai.core.head_grid_position;

        for entry in &self.common.human.core.path_history {
            if entry.grid_position == ai_snake_head_position {
                return Some(Collision::AiHeadToHumanBody);
            }
        }
        None
    }

    fn check_head_to_head_collision(
        &self,
        human_head_pixel_position: (i32, i32),
        ai_head_pixel_position: (i32, i32),
    ) -> Option<Collision> {
        let human_head_grid_position = self.common.human.core.head_grid_position;
        let ai_head_grid_position = self.ai.core.head_grid_position;

        let human_prev = (
            human_head_grid_position.0 - self.common.human.core.direction.0,
            human_head_grid_position.1 - self.common.human.core.direction.1,
        );
        let ai_prev = (
            ai_head_grid_position.0 - self.ai.core.direction.0,
            ai_head_grid_position.1 - self.ai.core.direction.1,
        );

        // Swapped head positions
        if human_head_grid_position == ai_prev && ai_head_grid_position == human_prev {
            return Some(Collision::HeadSwap);
        }

        // No collision
        if human_head_grid_position != ai_head_grid_position {
            return None;
        }

        let (x_cell_center, y_cell_center): (i32, i32) =
            grid_to_pixel_position!(human_head_grid_position, i32);

        let human_cell_center_proximity = (((human_head_pixel_position.0 - x_cell_center).pow(2)
            + (human_head_pixel_position.1 - y_cell_center).pow(2))
            as f64)
            .sqrt();

        let ai_cell_center_proximity = (((ai_head_pixel_position.0 - x_cell_center).pow(2)
            + (ai_head_pixel_position.1 - y_cell_center).pow(2))
            as f64)
            .sqrt();

        if human_cell_center_proximity == ai_cell_center_proximity {
            Some(Collision::HeadSwap)
        } else if human_cell_center_proximity < ai_cell_center_proximity {
            Some(Collision::AiHeadToHumanHead)
        } else {
            Some(Collision::HumanHeadToAiHead)
        }
    }

    pub fn get_ai_snake_position(&self) -> Vec<f64> {
        self.ai.core.get_head_pixel_position()
    }

    pub fn get_ai_snake_body_positions(&self) -> Vec<f64> {
        self.ai.core.get_body_positions()
    }
}
