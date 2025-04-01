mod game;

pub use game::game_state::GameState;
pub use game::snake::{core::SnakeCore, human::human::HumanSnake};

pub mod prelude {
    pub use super::{GameState, HumanSnake};
}
