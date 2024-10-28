// utils/parseLocation.js

export const parseLocationPosition = (locationPosition) => {
  const [latitude, longitude] = locationPosition
    .replace(/[()]/g, "")
    .split(",")
    .map((coord) => parseFloat(coord));
  return { latitude, longitude };
};
