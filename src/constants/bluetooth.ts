export const SERVICE = "0000fff0-0000-1000-8000-00805f9b34fb";
export const CHARACTERISTIC = "0000fff3-0000-1000-8000-00805f9b34fb";

export type EffectsArray = Pick<
  typeof EFFECTS,
  | "red"
  | "blue"
  | "green"
  | "cyan"
  | "yellow"
  | "magenta"
  | "white"
  | "jump_rgb"
  | "jump_rgbycmw"
  | "gradient_rgb"
  | "gradient_rgbycmw"
  | "gradient_r"
  | "gradient_g"
  | "gradient_b"
  | "gradient_y"
  | "gradient_c"
  | "gradient_m"
  | "gradient_w"
  | "gradient_rg"
  | "gradient_rb"
  | "gradient_gb"
  | "blink_rgbycmw"
  | "blink_r"
  | "blink_g"
  | "blink_b"
  | "blink_y"
  | "blink_c"
  | "blink_m"
  | "blink_w"
>;

export const EFFECTS = {
  red: 0x80,
  blue: 0x81,
  green: 0x82,
  cyan: 0x83,
  yellow: 0x84,
  magenta: 0x85,
  white: 0x86,
  jump_rgb: 0x87,
  jump_rgbycmw: 0x88,
  gradient_rgb: 0x89,
  gradient_rgbycmw: 0x8a,
  gradient_r: 0x8b,
  gradient_g: 0x8c,
  gradient_b: 0x8d,
  gradient_y: 0x8e,
  gradient_c: 0x8f,
  gradient_m: 0x90,
  gradient_w: 0x91,
  gradient_rg: 0x92,
  gradient_rb: 0x93,
  gradient_gb: 0x94,
  blink_rgbycmw: 0x95,
  blink_r: 0x96,
  blink_g: 0x97,
  blink_b: 0x98,
  blink_y: 0x99,
  blink_c: 0x9a,
  blink_m: 0x9b,
  blink_w: 0x9c,
};
