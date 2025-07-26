use crate::{
    game::{
        constants::CELL_SIZE_PX,
        enums::{Collision, GameEndCause, Winner},
        game_state::{common::GameStateCommon, utils::is_at_node},
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
    pub fn update(&mut self, delta_time: f64, current_time: f64) {
        self.common.check_and_start_timer(current_time);

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
            self.handle_snake_collision(collision, current_time);
            return;
        }

        // Check body collisions continuously (but using grid positions)
        if let Some(collision) = self.check_human_ai_body_collision_grid() {
            self.handle_snake_collision(collision, current_time);
            return;
        }

        if let Some(collision) = self.check_ai_human_body_collision_grid() {
            self.handle_snake_collision(collision, current_time);
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
                match self.common.check_winner(Some(&self.ai)) {
                    Winner::Human => self
                        .common
                        .game_end_with_timer(GameEndCause::Filled, current_time),
                    Winner::Ai => self
                        .common
                        .game_end_with_timer(GameEndCause::AiFilled, current_time),
                    Winner::Draw => self
                        .common
                        .game_end_with_timer(GameEndCause::BothFilled, current_time),
                    Winner::None => {}
                }

                self.common.handle_human_collision(collision, current_time);
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
                match self.common.check_winner(Some(&self.ai)) {
                    Winner::Human => self
                        .common
                        .game_end_with_timer(GameEndCause::Filled, current_time),
                    Winner::Ai => self
                        .common
                        .game_end_with_timer(GameEndCause::AiFilled, current_time),
                    Winner::Draw => self
                        .common
                        .game_end_with_timer(GameEndCause::BothFilled, current_time),
                    Winner::None => {}
                }

                self.handle_ai_collision(collision, current_time);
                return;
            }
        }
    }

    fn handle_ai_collision(&mut self, collision: Collision, current_time: f64) {
        match collision {
            Collision::Wall => self
                .common
                .game_end_with_timer(GameEndCause::AiHitWall, current_time),
            Collision::OwnBody => self
                .common
                .game_end_with_timer(GameEndCause::AiHitSelf, current_time),
            Collision::Food => {
                self.ai.core.grow();
                self.common.regenerate_food(Some(&self.ai));
            }
            _ => unreachable!(),
        }
    }

    fn handle_snake_collision(&mut self, collision: Collision, current_time: f64) {
        match collision {
            Collision::HumanHeadToAiHead => self
                .common
                .game_end_with_timer(GameEndCause::HumanHitAi, current_time),
            Collision::AiHeadToHumanHead => self
                .common
                .game_end_with_timer(GameEndCause::AiHitHuman, current_time),
            Collision::HumanHeadToAiBody => self
                .common
                .game_end_with_timer(GameEndCause::HumanHitAi, current_time),
            Collision::AiHeadToHumanBody => self
                .common
                .game_end_with_timer(GameEndCause::AiHitHuman, current_time),
            Collision::HeadSwap => self
                .common
                .game_end_with_timer(GameEndCause::HeadOnCollision, current_time),
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
