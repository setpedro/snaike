use crate::game::snake::core::SnakeCore;

pub trait DirectionHandler {
    fn process_input(&mut self, input: u8) {
        let current_dir = self.get_core().direction;
        let new_dir = match () {
            _ if input & 0b0001 != 0 => (0, -1), // Up
            _ if input & 0b1000 != 0 => (1, 0),  // Right
            _ if input & 0b0100 != 0 => (0, 1),  // Down
            _ if input & 0b0010 != 0 => (-1, 0), // Left
            _ => (current_dir.0, current_dir.1), // Fallback
        };

        if self.is_valid_direction(new_dir, current_dir) {
            self.get_core_mut().next_direction = Some(new_dir);
        }
    }

    fn is_valid_direction(&self, dir: (i32, i32), current_dir: (i32, i32)) -> bool {
        dir != current_dir && !(dir.0 == -current_dir.0 && dir.1 == -current_dir.1)
    }

    fn get_core(&self) -> &SnakeCore;
    fn get_core_mut(&mut self) -> &mut SnakeCore;
}
