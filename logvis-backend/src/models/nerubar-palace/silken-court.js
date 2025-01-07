/**
 * @fileoverview Defines the Silken Court boss encounter from Nerubar Palace
 * @module models/nerubar-palace/silken-court
 */

const Boss = require("../boss");

/**
 * Class representing the Silken Court boss encounter
 * @extends Boss
 */
class SilkenCourt extends Boss {
  /**
   * Creates a Silken Court boss instance
   * @constructor
   */
  constructor() {
    super(
      "The Silken Court",
      2921,
      [],
      [438708],
      [-3875, -262.5, -3125, 862.5]
    );
  }
}

module.exports = SilkenCourt;
