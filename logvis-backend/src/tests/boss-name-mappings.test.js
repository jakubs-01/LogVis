const {
  getBossShortName,
  getBossInitials,
} = require("../utils/boss-name-mappings");
//! Comment this stuff
describe("Various boss name mapping tests", () => {
  test("Short Name Mapping", () => {
    expect(getBossShortName("Ulgrax the Devourer")).toBe("Ulgrax");
  });
  test("Initial Mapping", () => {
    expect(getBossInitials("Ulgrax the Devourer")).toBe("U");
  });
  test("Short Name Missing", () => {
    const consoleSpy = jest.spyOn(console, "log");

    expect(getBossShortName("Unknown Boss")).toBe("Unknown Boss");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Missing short name mapping for: Unknown Boss"
    );
    consoleSpy.mockRestore();
  });
  test("Initial Missing", () => {
    const consoleSpy = jest.spyOn(console, "log");
    expect(getBossInitials("Unknown Boss")).toBe("Unknown Boss");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Missing initial mapping for: Unknown Boss"
    );
    consoleSpy.mockRestore();
  });
});
