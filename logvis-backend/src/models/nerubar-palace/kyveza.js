/**
 * @fileoverview Defines the Kyveza boss encounter from Nerubar Palace
 * @module models/nerubar-palace/kyveza
 */

const Boss = require("../boss");

/**
 * Class representing the Kyveza boss encounter
 * @extends Boss
 */
class Kyveza extends Boss {
  /**
   * Creates a Kyveza boss instance
   * @constructor
   */
  constructor() {
    super("Kyveza", 1234, [437469, 436934], [], [-3875, -262.5, -3125, 862.5]);
  }

  // If Kyveza requires a specific fetchMechanics implementation, override it
  // Otherwise, it will use the default implementation from the base class
}

module.exports = Kyveza;
