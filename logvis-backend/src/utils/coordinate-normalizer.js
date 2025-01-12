const logger = require("../services/logging-service");

/**
 *
 * @param {float} region0 Region_0 value
 * @param {float} region1 Region_1 value
 * @param {float} region3 Region_3 value
 * @param {float} region4 Region_4 Value
 * @param {float} x Raw X coordinate value
 * @param {float} y Raw Y coordinate value
 * @returns {float[]}
 * @see https://wago.tools/db2/UiMapAssignment?page=1&build=11.0.5.57212&filter[UiMapID]=2294&sort[MapID]=asc for example values
 */

function normalizeCoordinates(region0, region1, region3, region4, x, y) {
  logger.debug("Normalizing coordinates", {
    region0,
    region1,
    region3,
    region4,
    x,
    y,
  });
  const params = [region0, region1, region3, region4, x, y];
  if (!params.every((param) => typeof param === "number")) {
    throw new Error("Invalid parameter type");
  }
  const xMin = parseFloat(region4).toFixed(2) * -100;
  const xMax = parseFloat(region1).toFixed(2) * -100;
  const yMin = parseFloat(region0).toFixed(2) * 100;
  const yMax = parseFloat(region3).toFixed(2) * 100;

  const normalizedX = (x - xMin) / (xMax - xMin);
  const normalizedY = (y - yMin) / (yMax - yMin);
  logger.debug("Normalized coordinates", { normalizedX, normalizedY });
  return [normalizedX, normalizedY];
}

module.exports = normalizeCoordinates;
