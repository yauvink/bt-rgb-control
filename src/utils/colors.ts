const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const formatHex = (number: number) => {
  if (number > 255) {
    return 255;
  } else if (number < 0) {
    return 0;
  }
  return number;
};

const formatPerc = (number: number) => {
  if (number > 100) {
    return 100;
  } else if (number < 0) {
    return 0;
  }
  return number;
};

export { hexToRgb, rgbToHex, formatHex, formatPerc };
