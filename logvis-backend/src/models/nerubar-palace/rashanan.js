/**
 * @fileoverview Defines the Rasha'nan boss encounter from Nerubar Palace
 * @module models/nerubar-palace/rashanan
 */

const Boss = require("../boss");

/**
 * Class representing the Rasha'nan boss encounter
 * @extends Boss
 */
class Rashanan extends Boss {
  /**
   * Creates a Rasha'nan boss instance
   * @constructor
   */
  constructor() {
    super("Rasha'nan", 1234, [439781], [], [-3450, -915, -2500, 510]);
  }
}

module.exports = Rashanan;
