/**
 * @fileoverview This module provides mappings for boss names to their short names and initials.
 * @module utils/boss-name-mappings
 */

const shortnameMap = {
  "Ulgrax the Devourer": "Ulgrax",
  "The Bloodbound Horror": "Bloodbound Horror",
  "Sikran, Captain of the Sureki": "Sikran",
  "Rasha'nan": "Rashanan",
  "Broodtwister Ovi'Nax": "Ovinax",
  "Nexus-Princess Ky'veza": "Kyveza",
  "The Silken Court": "Silken Court",
  "Queen Ansurek": "Ansurek",
};

/**
 * A mapping of boss names to their initials.
 * @type {Object<string, string>}
 */
const initialMap = {
  "Ulgrax the Devourer": "U",
  "The Bloodbound Horror": "BH",
  "Sikran, Captain of the Sureki": "S",
  "Rasha'nan": "R",
  "Broodtwister Ovi'Nax": "O",
  "Nexus-Princess Ky'veza": "K",
  "The Silken Court": "SC",
  "Queen Ansurek": "A",
};

/**
 * Retrieves the short name for a given boss name.
 * @param {string} name - The full name of the boss.
 * @returns {string} The short name of the boss, or the original name if no mapping exists.
 */
function getBossShortName(name) {
  if (!shortnameMap[name]) {
    console.log("Missing short name mapping for: " + name);
  }
  return shortnameMap[name] || name;
}

/**
 * Retrieves the initials for a given boss name.
 * @param {string} name - The full name of the boss.
 * @returns {string} The initials of the boss, or the original name if no mapping exists.
 */
function getBossInitials(name) {
  if (!initialMap[name]) {
    console.log("Missing initial mapping for: " + name);
  }
  return initialMap[name] || name;
}

module.exports = { getBossShortName, getBossInitials };
