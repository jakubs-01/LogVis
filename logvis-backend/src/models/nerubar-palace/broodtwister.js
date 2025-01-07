/**
 * @fileoverview Defines the Broodtwister Ovi'nax boss encounter from Nerubar Palace
 * @module models/nerubar-palace/broodtwister
 */

const Boss = require("../boss");

/**
 * Class representing the Broodtwister Ovi'nax boss encounter
 * @extends Boss
 */
class Broodtwister extends Boss {
  /**
   * Creates a Broodtwister Ovi'nax boss instance
   * @constructor
   */
  constructor() {
    super(
      "Broodtwister Ovi'nax",
      1234,
      [442660],
      [],
      [-3875, -262.5, -3125, 862.5]
    );
  }
}

module.exports = Broodtwister;
