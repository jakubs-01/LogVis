/**
 * @fileoverview Factory module for creating boss instances from the Nerubar Palace raid
 * @module models/boss-factory
 */

const Ulgrax = require("./nerubar-palace/ulgrax");
const Bloodbound = require("./nerubar-palace/bloodbound");
const Sikran = require("./nerubar-palace/sikran");
const Rashanan = require("./nerubar-palace/rashanan");
const Broodtwister = require("./nerubar-palace/broodtwister");
const Kyveza = require("./nerubar-palace/kyveza");
const SilkenCourt = require("./nerubar-palace/silken-court");
const Ansurek = require("./nerubar-palace/ansurek");

/**
 * Creates an instance of a specific boss based on the boss name
 * @param {string} bossName - The name of the boss to create an instance of
 * @returns {(Ulgrax|Bloodbound|Sikran|Rashanan|Broodtwister|Kyveza|SilkenCourt|Ansurek)} The boss instance
 * @throws {Error} If the boss name is not recognized
 */
function createBossInstance(bossName) {
  switch (bossName.toLowerCase().replace(/\s+/g, "")) {
    case "ulgraxthedevourer":
      return new Ulgrax();
    case "thebloodboundhorror":
      return new Bloodbound();
    case "sikran,captainofthesureki":
      return new Sikran();
    case "rasha'nan":
      return new Rashanan();
    case "broodtwisterovi'nax":
      return new Broodtwister();
    case "nexus-princessky'veza":
      return new Kyveza();
    case "thesilkencourt":
    case "silkencourt":
      return new SilkenCourt();
    case "queenansurek":
      return new Ansurek();
    default:
      throw new Error(`Boss "${bossName}" not found`);
  }
}

module.exports = createBossInstance;
