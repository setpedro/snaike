#[macro_use]
mod macros;

mod game;

pub use game_state::solo::SoloGameState;
pub use game_state::versus::VersusGameState;

pub use game::snake::{core::SnakeCore, human::human::HumanSnake};
pub use game::utils::wasm_bindings::{get_grid_constants, GridConstants};

use crate::game::game_state;

pub mod prelude {
    pub use super::{get_grid_constants, GridConstants, HumanSnake, SoloGameState};
}
