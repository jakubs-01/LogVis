/**
 * @fileoverview Defines the Bloodbound Horror boss encounter from Nerubar Palace
 * @module models/nerubar-palace/bloodbound
 */

const Boss = require("../boss");

/**
 * Class representing the Bloodbound Horror boss encounter
 * @extends Boss
 */
class Bloodbound extends Boss {
  /**
   * Creates a Bloodbound Horror boss instance
   * @constructor
   */
  constructor() {
    super(
      "The Bloodbound Horror",
      1234,
      [444363],
      [],
      [-3910.419921875, -1429.1700439453, -2512.5, 666.666015625]
    );
  }
}

module.exports = Bloodbound;
