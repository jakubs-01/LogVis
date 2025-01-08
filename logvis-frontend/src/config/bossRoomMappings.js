const BossRoomMappings = {
  "Ulgrax the Devourer": {
    zoomFactor: 6,
    translateX: -2700,
    translateY: -1200,
    mapID: 2292,
    435152: {
      name: "Digestive Acid",
      icon: "https://wow.zamimg.com/images/wow/icons/large/ability_creature_disease_03.jpg",
      description: "{placeholder} cleared webs with Digestive Acid",
    },
  },

  "The Bloodbound Horror": {
    //!Consider Zoom 6 on this
    zoomFactor: 5,
    translateX: -1700,
    translateY: -2000,
    mapID: 2291,
    444363: {
      name: "Gruesome Disgorge",
      icon: "https://wow.zamimg.com/images/wow/icons/large/ability_warlock_shadowflame.jpg",
      description: "{placeholder} entered downstairs phase",
    },
  },

  "Sikran, Captain of the Sureki": {
    zoomFactor: 5,
    translateX: -2450,
    translateY: -650,
    mapID: 2293,
    434155: {
      name: "Phase Blades",
      icon: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldcharge.jpg",
      description: "{placeholder} was hit by Sikran's Phase Blades",
    },
  },

  "Rasha'nan": {
    zoomFactor: 4,
    translateX: -1000,
    translateY: -1350,
    mapID: 2292,
    439781: {
      name: "Spinneret's Strands",
      icon: "https://wow.zamimg.com/images/wow/icons/large/inv_ability_web_beam.jpg",
      description: "{placeholder} dropped off webs",
    },
  },

  "Broodtwister Ovi'nax": {
    zoomFactor: 4,
    translateX: -1750,
    translateY: -1700,
    mapID: 2294,
    442660: {
      name: "Experimental Dosage",
      icon: "https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_bloodplague.jpg",
      description: "Experimental Dosage expired on {placeholder}",
    },
  },

  "Nexus-Princess Ky'veza": {
    zoomFactor: 5,
    translateX: -800,
    translateY: -1200,
    mapID: 2294,
    437469: {
      name: "Queensbane",
      icon: "https://wow.zamimg.com/images/wow/icons/large/spell_shadow_painspike.jpg",
      description: "Queensbane expired on {placeholder}",
    },
    436934: {
      name: "Assassination",
      icon: "https://wow.zamimg.com/images/wow/icons/large/ability_theblackarrow.jpg",
      description: "Assassination dropped off by {placeholder}",
    },
  },

  "The Silken Court": {
    zoomFactor: 5,
    translateX: -1650,
    translateY: -1350,
    mapID: 2294,
    438708: {
      name: "Stinging Swarm",
      icon: "https://wow.zamimg.com/images/wow/icons/large/spell_nature_insect_swarm2.jpg",
      description: "Stinging Swarm was dispelled on {placeholder}",
    },
  },
  //!Ansurek also needs 2296 implemented for P3
  "Queen Ansurek": {
    zoomFactor: 1.5,
    translateX: -200,
    translateY: -220,
    mapID: 2295,
    mapID_alt: 2296,
    439865: {
      name: "Silken Tomb",
      icon: "https://wow.zamimg.com/images/wow/icons/large/inv_ability_web_buff.jpg",
      description: "Silken Tomb was applied to {placeholder}",
    },
    445152: {
      name: "Acolyte's Essence",
      icon: "https://wow.zamimg.com/images/wow/icons/large/inv_cosmicvoid_buff.jpg",
      description: "Acolyte's Essence dropped by {placeholder}",
    },
  },
};

/**
 * Returns the entire BossRoomMappings object.
 * @returns {Object} The BossRoomMappings object.
 */
function getObject() {
  return BossRoomMappings;
}

/**
 * Retrieves the zoom factor for a given boss.
 * @param {string} bossName - The name of the boss.
 * @returns {number} The zoom factor for the specified boss.
 */
function getZoomFactor(bossName) {
  return BossRoomMappings[bossName].zoomFactor;
}

/**
 * Retrieves the translation offsets for a given boss.
 * @param {string} bossName - The name of the boss.
 * @returns {Array<number>} An array containing the translateX and translateY offsets.
 */
function getOffsets(bossName) {
  return [
    BossRoomMappings[bossName].translateX,
    BossRoomMappings[bossName].translateY,
  ];
}

/**
 * Retrieves the map ID for a given boss.
 * @param {string} bossName - The name of the boss.
 * @returns {number} The map ID for the specified boss.
 */
function getMapID(bossName) {
  return BossRoomMappings[bossName].mapID;
}

/**
 * Retrieves the alternate map ID for a given boss.
 * @param {string} bossName - The name of the boss.
 * @returns {number} The alternate map ID for the specified boss.
 */
function getMapID_alt(bossName) {
  return BossRoomMappings[bossName].mapID_alt;
}

/**
 * Retrieves all abilities for a given boss.
 * @param {string} bossName - The name of the boss.
 * @returns {Object} An object containing all abilities for the specified boss.
 */
function getAbilities(bossName) {
  return BossRoomMappings[bossName];
}

/**
 * Retrieves information about a specific ability for a given boss.
 * @param {string} bossName - The name of the boss.
 * @param {number} abilityID - The ID of the ability.
 * @returns {Object} An object containing information about the specified ability.
 */
function getAbilityInfo(bossName, abilityID) {
  return BossRoomMappings[bossName][abilityID];
}

/**
 * Retrieves the icon URL for a specific ability of a given boss.
 * @param {string} bossName - The name of the boss.
 * @param {number} abilityID - The ID of the ability.
 * @returns {string} The icon URL for the specified ability.
 */
function getAbilityIcon(abilityID) {
  // Search through all bosses to find the one with this ability ID
  for (const boss in BossRoomMappings) {
    if (BossRoomMappings[boss][abilityID]) {
      return BossRoomMappings[boss][abilityID].icon;
    }
  }
  return null; // Return null if ability ID not found
}

/**
 * Retrieves the name of a specific ability for a given boss.
 * @param {string} bossName - The name of the boss.
 * @param {number} abilityID - The ID of the ability.
 * @returns {string} The name of the specified ability.
 */
function getAbilityName(abilityID) {
  for (const boss in BossRoomMappings) {
    if (BossRoomMappings[boss][abilityID]) {
      return BossRoomMappings[boss][abilityID].name;
    }
  }
  return null; // Return null if ability ID not found
}

function getAbilityDescription(abilityID) {
  for (const boss in BossRoomMappings) {
    if (BossRoomMappings[boss][abilityID]) {
      return BossRoomMappings[boss][abilityID].description;
    }
  }
  return null; // Return null if ability ID not found
}

module.exports = {
  getObject,
  getZoomFactor,
  getOffsets,
  getMapID,
  getMapID_alt,
  getAbilities,
  getAbilityInfo,
  getAbilityIcon,
  getAbilityName,
  getAbilityDescription,
};
