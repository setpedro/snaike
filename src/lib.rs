#[macro_use]
mod macros;

mod game;

pub use game::game_state::GameState;
pub use game::snake::{core::SnakeCore, human::human::HumanSnake};
pub use game::utils::wasm_bindings::{get_grid_constants, GridConstants};

pub mod prelude {
    pub use super::{get_grid_constants, GameState, GridConstants, HumanSnake};
}
