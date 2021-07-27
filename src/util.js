import ColorHash from 'color-hash';

export const createHexColor = (string = '', saturation = 0.75, lightness = 0.60) => {
  const colorHash = new ColorHash({
    saturation,
    lightness,
  });

  return colorHash.hex(string);
};
