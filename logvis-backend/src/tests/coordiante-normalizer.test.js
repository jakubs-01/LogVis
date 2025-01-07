const normalizeCoordinates = require("../utils/coordinate-normalizer");

describe("Test converting various coordinates", () => {
  //Kyveza world map 2294 UiMapID 70889 WMOGroupID
  //https://wago.tools/db2/WMOAreaTable?build=11.0.5.57212&filter%5BWMOGroupID%5D=exact%3A70889
  test("Normalize Kyveza room test", () => {
    const coords = normalizeCoordinates(
      -3875,
      -262.5,
      -3125,
      862.5,
      -61715,
      -348171
    );
    expect(coords[0]).toBe(0.2180888888888889);
    expect(coords[1]).toBe(0.5243866666666667);
  });

  //Silken world map 2294 UiMapID 70893 WMOGroupID
  //https://wago.tools/db2/WMOAreaTable?build=11.0.5.57212&filter%5BWMOGroupID%5D=exact%3A70893
  test("Normalize Silken room test", () => {
    const coords = normalizeCoordinates(
      -3875,
      -262.5,
      -3125,
      862.5,
      -39330,
      -352761
    );
    expect(coords[0]).toBe(0.41706666666666664);
    expect(coords[1]).toBe(0.4631866666666667);
  });
  // ! This should be handled inside the function as infinity has no real-use purpose
  //Identical reigon values would imply the map area is confined to a single point
  test("Normalize with identical region values", () => {
    const coords = normalizeCoordinates(100, 100, 100, 100, 50, 50);
    expect(coords[0]).toBe(Infinity);
    expect(coords[1]).toBe(-Infinity);
  });

  /// Invalud inputs throw an exception
  test("Normalize with invalid inputs", () => {
    expect(() => {
      normalizeCoordinates("a", "b", "c", "d", "e", "f");
    }).toThrow();
  });

  test("Normalize with large coordinate values", () => {
    const coords = normalizeCoordinates(1e12, 1e15, 1e13, 1e14, 5e14, 5e14);
    expect(coords[0]).toBeLessThanOrEqual(0);
    expect(coords[1]).toBeGreaterThanOrEqual(0);
  });

  test("Return type should be an array", () => {
    const coords = normalizeCoordinates(
      -3875,
      -262.5,
      -3125,
      862.5,
      -61715,
      -348171
    );
    expect(Array.isArray(coords)).toBe(true);
    expect(typeof coords[0]).toBe("number");
    expect(typeof coords[1]).toBe("number");
  });
});
