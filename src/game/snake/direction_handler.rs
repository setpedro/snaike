use crate::game::constants::{DOWN, LEFT, RIGHT, UP};
use crate::game::snake::core::SnakeCore;

pub fn handle_direction(core: &mut SnakeCore, input: u8) {
    let new_dir = match () {
        _ if input & UP != 0 => (0, -1),
        _ if input & RIGHT != 0 => (1, 0),
        _ if input & DOWN != 0 => (0, 1),
        _ if input & LEFT != 0 => (-1, 0),
        _ => (core.direction.0, core.direction.1),
    };

    if is_valid_direction(new_dir, core.direction) {
        core.next_direction = Some(new_dir);
    }
}

fn is_valid_direction(dir: (i32, i32), current_dir: (i32, i32)) -> bool {
    dir != current_dir && !(dir.0 == -current_dir.0 && dir.1 == -current_dir.1)
}
