use crate::game::snake::core::SnakeCore;

pub fn handle_direction(core: &mut SnakeCore, input: u8) {
    let new_dir = match () {
        _ if input & 0b0001 != 0 => (0, -1),       // Up
        _ if input & 0b1000 != 0 => (1, 0),        // Right
        _ if input & 0b0100 != 0 => (0, 1),        // Down
        _ if input & 0b0010 != 0 => (-1, 0),       // Left
        _ => (core.direction.0, core.direction.1), // Fallback
    };

    if is_valid_direction(new_dir, core.direction) {
        core.next_direction = Some(new_dir);
    }
}

fn is_valid_direction(dir: (i32, i32), current_dir: (i32, i32)) -> bool {
    dir != current_dir && !(dir.0 == -current_dir.0 && dir.1 == -current_dir.1)
}
