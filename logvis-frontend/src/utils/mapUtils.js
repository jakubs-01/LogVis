export const calculatePointPosition = (x, y, width, height) => ({
  x: x * width,
  y: (1 - y) * height,
});

export const formatTimestamp = (ms) => {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
