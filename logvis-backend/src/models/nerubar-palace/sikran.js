/**
 * @fileoverview Defines the Sikran boss encounter from Nerubar Palace
 * @module models/nerubar-palace/sikran
 */

const Boss = require("../boss");

/**
 * Class representing the Sikran boss encounter
 * @extends Boss
 */
class Sikran extends Boss {
  /**
   * Creates a Sikran boss instance
   * @constructor
   */
  constructor() {
    super(
      "Sikran, Captain of the Sureki",
      1234,
      [434155],
      [],
      [-3875, -847.5, -3225, 127.5]
    );
  }
}

module.exports = Sikran;
