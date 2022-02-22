import { hexToRgb } from "./colors";

const getRGBValue = (color: string) => {
  const rgbColor = hexToRgb(color);
  return new Uint8Array([
    0x7e,
    0x00,
    0x05,
    0x03,
    rgbColor?.r,
    rgbColor?.g,
    rgbColor?.b,
    0x00,
    0xef,
  ] as any).buffer;
};

const getEffectValue = (effect: string | number) => {
  return new Uint8Array([
    0x7e,
    0x00,
    0x03,
    `0x${effect.toString(16)}`,
    0x03,
    0x00,
    0x00,
    0x00,
    0xef,
  ] as any).buffer;
};

const getBrightnessValue = (brightness: number | number[]) => {
  return new Uint8Array([
    0x7e,
    0x00,
    0x01,
    `0x${brightness.toString(16)}`,
    0x00,
    0x00,
    0x00,
    0x00,
    0xef,
  ] as any).buffer;
};

const getEffectSpeedValue = (effectSpeed: number | number[]) => {
  return new Uint8Array([
    0x7e,
    0x00,
    0x02,
    `0x${effectSpeed.toString(16)}`,
    0x00,
    0x00,
    0x00,
    0x00,
    0xef,
  ] as any).buffer;
};

export { getRGBValue, getEffectValue, getBrightnessValue, getEffectSpeedValue };
