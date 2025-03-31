mod game_state;
mod snake;

pub use game_state::GameState;
pub use snake::{
    core::{SnakeCore, Vec2},
    human::human::HumanSnake,
};

pub mod prelude {
    pub use super::{GameState, HumanSnake, Vec2};
}
