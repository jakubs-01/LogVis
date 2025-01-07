/**
 * @fileoverview Defines the Ulgrax The Devourer boss encounter from Nerubar Palace
 * @module models/nerubar-palace/ulgrax
 */

const Boss = require("../boss");

/**
 * Class representing the Ulgrax The Devourer boss encounter
 * @extends Boss
 */
class Ulgrax extends Boss {
  /**
   * Creates an Ulgrax The Devourer boss instance
   * @constructor
   */
  constructor() {
    super("Ulgrax The Devourer", 1234, [435152], [], [-3450, -915, -2500, 510]);
  }
}

module.exports = Ulgrax;
