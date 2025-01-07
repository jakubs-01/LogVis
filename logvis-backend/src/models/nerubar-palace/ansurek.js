/**
 * @fileoverview Defines the Queen Ansurek boss encounter from Nerubar Palace
 * @module models/nerubar-palace/ansurek
 */

const Boss = require("../boss");

/**
 * Class representing the Queen Ansurek boss encounter
 * @extends Boss
 */
class Ansurek extends Boss {
  /**
   * Creates a Queen Ansurek boss instance
   * @constructor
   */
  constructor() {
    super(
      "Queen Ansurek",
      1234,
      [439865],
      [445152],
      [-3911.1499023438, 239.99266052246, -3463.8500976562, 910.9423828125]
    );
  }
}

module.exports = Ansurek;
