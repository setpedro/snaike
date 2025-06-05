#[macro_export]
macro_rules! grid_to_pixel_position {
    ($grid_coords:expr, $output_type:ty) => {{
        let to_pixel = |coord| ((coord as f64 + 0.5) * CELL_SIZE_PX as f64) as $output_type;
        (to_pixel($grid_coords.0), to_pixel($grid_coords.1))
    }};
}
