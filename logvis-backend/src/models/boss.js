/**
 * Represents a boss encounter with associated abilities and regions
 * @class
 */
class Boss {
  /**
   * Creates a new Boss instance
   * @param {string} name - The name of the boss
   * @param {number} encounterId - The unique encounter ID for this boss
   * @param {number[]} abilities - Array of ability IDs associated with this boss
   * @param {number[]} debuffs - Array of debuff IDs associated with this boss
   * @param {Object[]} regions - Array of region objects defining areas for this boss encounter
   */
  constructor(name, encounterId, abilities, debuffs, regions) {
    this.name = name;
    this.encounterId = encounterId;
    this.abilities = abilities;
    this.regions = regions;
    this.debuffs = debuffs;
  }
}

module.exports = Boss;
