/* tslint:disable */
/* eslint-disable */
export function getGridConstants(): GridConstants;
export class BodySegment {
  private constructor();
  free(): void;
}
export class GameStateCommon {
  free(): void;
  constructor();
  food(): Int32Array;
  get_human_snake_position(): Float64Array;
  get_human_snake_body_positions(): Float64Array;
  set_input_key(key: string, is_pressed: boolean): void;
}
export class GridConstants {
  private constructor();
  free(): void;
  readonly cols: number;
  readonly rows: number;
  readonly cellSizePx: number;
}
export class HumanSnake {
  free(): void;
  constructor();
  update(delta_time: number): void;
}
export class InputState {
  free(): void;
  constructor();
  set_key(key: string, is_pressed: boolean): void;
  pressed: number;
}
export class PathEntry {
  private constructor();
  free(): void;
}
export class SnakeCore {
  free(): void;
  constructor(pos_x: number, pos_y: number, dir_x: number, dir_y: number, speed: number);
  update_movement(delta_time: number): void;
  grow(): void;
  get_body_positions(): Float64Array;
  get_head_pixel_position(): Float64Array;
  check_self_collision(): boolean;
  grow_counter: number;
  readonly direction: Int32Array;
}
export class SoloGameState {
  free(): void;
  get_human_snake_position(): Float64Array;
  get_human_snake_body_positions(): Float64Array;
  set_input_key(key: string, is_pressed: boolean): void;
  constructor();
  update(delta_time: number, current_time: number): void;
  readonly food: Int32Array;
}
export class VersusGameState {
  free(): void;
  get_human_snake_position(): Float64Array;
  get_human_snake_body_positions(): Float64Array;
  set_input_key(key: string, is_pressed: boolean): void;
  constructor();
  update(delta_time: number, current_time: number): void;
  get_ai_snake_position(): Float64Array;
  get_ai_snake_body_positions(): Float64Array;
  readonly food: Int32Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_inputstate_free: (a: number, b: number) => void;
  readonly __wbg_get_inputstate_pressed: (a: number) => number;
  readonly __wbg_set_inputstate_pressed: (a: number, b: number) => void;
  readonly inputstate_new: () => number;
  readonly inputstate_set_key: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_humansnake_free: (a: number, b: number) => void;
  readonly humansnake_new: () => number;
  readonly humansnake_update: (a: number, b: number) => void;
  readonly __wbg_snakecore_free: (a: number, b: number) => void;
  readonly __wbg_get_snakecore_grow_counter: (a: number) => number;
  readonly __wbg_set_snakecore_grow_counter: (a: number, b: number) => void;
  readonly __wbg_pathentry_free: (a: number, b: number) => void;
  readonly __wbg_bodysegment_free: (a: number, b: number) => void;
  readonly snakecore_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly snakecore_update_movement: (a: number, b: number) => void;
  readonly snakecore_grow: (a: number) => void;
  readonly snakecore_get_body_positions: (a: number) => [number, number];
  readonly snakecore_get_head_pixel_position: (a: number) => [number, number];
  readonly snakecore_check_self_collision: (a: number) => number;
  readonly snakecore_direction: (a: number) => [number, number];
  readonly __wbg_versusgamestate_free: (a: number, b: number) => void;
  readonly versusgamestate_food: (a: number) => [number, number];
  readonly versusgamestate_get_human_snake_position: (a: number) => [number, number];
  readonly versusgamestate_get_human_snake_body_positions: (a: number) => [number, number];
  readonly versusgamestate_set_input_key: (a: number, b: number, c: number, d: number) => void;
  readonly versusgamestate_new: () => number;
  readonly versusgamestate_update: (a: number, b: number, c: number) => void;
  readonly versusgamestate_get_ai_snake_position: (a: number) => [number, number];
  readonly versusgamestate_get_ai_snake_body_positions: (a: number) => [number, number];
  readonly __wbg_sologamestate_free: (a: number, b: number) => void;
  readonly sologamestate_food: (a: number) => [number, number];
  readonly sologamestate_get_human_snake_position: (a: number) => [number, number];
  readonly sologamestate_get_human_snake_body_positions: (a: number) => [number, number];
  readonly sologamestate_set_input_key: (a: number, b: number, c: number, d: number) => void;
  readonly sologamestate_new: () => number;
  readonly sologamestate_update: (a: number, b: number, c: number) => void;
  readonly __wbg_gridconstants_free: (a: number, b: number) => void;
  readonly __wbg_get_gridconstants_cols: (a: number) => number;
  readonly __wbg_get_gridconstants_rows: (a: number) => number;
  readonly __wbg_get_gridconstants_cellSizePx: (a: number) => number;
  readonly getGridConstants: () => number;
  readonly __wbg_gamestatecommon_free: (a: number, b: number) => void;
  readonly gamestatecommon_new: () => number;
  readonly gamestatecommon_food: (a: number) => [number, number];
  readonly gamestatecommon_get_human_snake_position: (a: number) => [number, number];
  readonly gamestatecommon_get_human_snake_body_positions: (a: number) => [number, number];
  readonly gamestatecommon_set_input_key: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
