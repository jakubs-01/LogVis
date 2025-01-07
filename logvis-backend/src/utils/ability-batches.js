/**
 * @typedef {Object} AbilityBatchRange
 * @property {string} start - The start timestamp of the ability range in "mm:ss.ms" format.
 * @property {string} end - The end timestamp of the ability range in "mm:ss.ms" format.
 * @property {string} set - The identifier for the set this range belongs to.
 */

/**
 * @typedef {Object.<number, AbilityBatchRange[]>} AbilityBatchInfo
 * A mapping of spell IDs to an array of ability ranges. Each key represents a spell ID,
 * and the value is an array of ranges for that spell.
 */

/** @type {AbilityBatchInfo} */
const abilityBatchInfo = {
  //Ulgrax Digestive Acid depends on when boss is pushed so maybe look into this
  435152: [
    { start: "00:00.000", end: "00:45.352", set: "set1" },
    { start: "00:45.353", end: "02:06.393", set: "set2" },
    { start: "02:06.394", end: "03:29.167", set: "set3" },
    { start: "03:29.168", end: "04:57.121", set: "set4" },
    { start: "04:57.122", end: "06:16.157", set: "set5" },
    { start: "06:16.158", end: "06:31.279", set: "set6" },
  ],
  //Bloodbound Horror Gruesome Disgorge (entering other Realm)
  444363: [
    { start: "00:17.000", end: "00:22.000", set: "set1" },
    { start: "01:15.000", end: "01:20.000", set: "set2" },
    { start: "02:25.000", end: "02:30.000", set: "set3" },
    { start: "03:15.000", end: "03:20.000", set: "set4" },
  ],
  //Sikran Phase Rush
  434155: [
    { start: "00:17.000", end: "00:22.000", set: "set1" },
    { start: "00:45.000", end: "00:50.000", set: "set2" },
    { start: "01:12.000", end: "01:17.000", set: "set3" },
    { start: "01:56.000", end: "02:01.000", set: "set4" },
    { start: "02:24.000", end: "02:29.000", set: "set5" },
    { start: "02:52.000", end: "02:57.000", set: "set6" },
    { start: "03:23.000", end: "03:28.000", set: "set7" },
    { start: "04:00.000", end: "04:05.000", set: "set8" },
    { start: "04:17.000", end: "04:22.000", set: "set9" },
    { start: "05:08.000", end: "05:13.000", set: "set10" },
    { start: "05:25.000", end: "05:30.000", set: "set11" },
  ],
  // Rashanan Spinneret's Strands (Web Tether Break)
  439781: [
    { start: "00:14.225", end: "00:24.225", set: "set1" },
    { start: "01:39.129", end: "01:47.129", set: "set2" },
    { start: "02:29.610", end: "02:37.610", set: "set3" },
    { start: "02:44.838", end: "02:52.838", set: "set4" },
    { start: "03:36.506", end: "03:44.506", set: "set5" },
    { start: "05:43.006", end: "05:51.006", set: "set6" },
    { start: "06:02.959", end: "06:10.959", set: "set7" },
    { start: "07:18.832", end: "07:26.832", set: "set8" },
  ],
  //Broodtwister Ovi'nax Experimental Dosage (Egg Break)
  442660: [
    { start: "00:37.773", end: "00:51.773", set: "set1" },
    { start: "01:27.780", end: "01:41.780", set: "set2" },
    { start: "02:17.762", end: "02:31.762", set: "set3" },
    { start: "03:31.917", end: "03:45.917", set: "set4" },
    { start: "04:21.947", end: "04:35.947", set: "set5" },
    { start: "05:11.910", end: "05:25.910", set: "set6" },
    { start: "06:27.254", end: "06:41.254", set: "set7" },
    { start: "07:17.290", end: "07:31.290", set: "set8" },
    { start: "08:07.273", end: "08:21.273", set: "set9" },
  ],
  // Kyveza Queensbane (Debuff Expiring)
  437469: [
    { start: "00:24.073", end: "00:28.073", set: "set1" },
    { start: "00:47.474", end: "00:51.474", set: "set2" },
    { start: "01:17.356", end: "01:21.356", set: "set3" },
    { start: "02:34.036", end: "02:38.036", set: "set4" },
    { start: "02:57.349", end: "03:01.349", set: "set5" },
    { start: "03:27.392", end: "03:31.392", set: "set6" },
    { start: "04:44.032", end: "04:48.032", set: "set7" },
    { start: "05:07.375", end: "05:11.375", set: "set8" },
    { start: "05:37.397", end: "05:41.397", set: "set9" },
  ],
  // Kyveza Assassination (Portal Placement)
  436934: [
    { start: "00:15.038", end: "00:19.038", set: "set1" },
    { start: "02:25.032", end: "02:29.032", set: "set2" },
    { start: "04:35.025", end: "04:39.025", set: "set3" },
  ],
  // Silken Court Stinging Swarm (Dispel)
  438708: [
    { start: "02:50.000", end: "03:40.000", set: "set1" },
    { start: "03:55.000", end: "04:45.000", set: "set2" },
    { start: "06:35.000", end: "07:15.000", set: "set3" },
    { start: "07:25.000", end: "09:20.000", set: "set4" },
  ],
  //Ansurek Silken Tomb
  439865: [
    //First Set
    { start: "00:16.000", end: "00:18.000", set: "set1" },
    //Second Set
    { start: "00:56.000", end: "00:58.000", set: "set2" },
    //Third Set
    { start: "01:53.000", end: "01:55.000", set: "set3" },
  ],
  445152: [
    { start: "06:00.000", end: "07:00.000", set: "set1" },
    { start: "07:43.837", end: "08:18.837", set: "set2" },
  ],
};

/**
 * Converts a timestamp in "mm:ss.ms" format to milliseconds
 * @param {string} timestamp - Timestamp in "mm:ss.ms" format
 * @returns {number} Timestamp in milliseconds
 */
function convertToMs(timestamp) {
  const [minutes, seconds] = timestamp.split(":");
  const [secs, ms] = seconds.split(".");
  return parseInt(minutes) * 60 * 1000 + parseInt(secs) * 1000 + parseInt(ms);
}

/**
 * Finds the set name corresponding to a given timestamp for a specific spell ID.
 *
 * This function performs a binary search on the ranges associated with the given spell ID
 * to determine which range the provided timestamp falls into. If a matching range is found,
 * it returns the name of the set associated with that range. If no matching range is found,
 * it returns null.
 *
 * @param {number} spellID - The unique identifier for the spell.
 * @param {string} timestamp - The timestamp to find the corresponding range for in "mm:ss.ms" format.
 * @returns {string|null} The name of the set if a matching range is found, otherwise null.
 */
function findRangeForTimeStamp(spellID, timestamp) {
  let ranges = abilityBatchInfo[spellID];
  let left = 0,
    right = ranges.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let range = ranges[mid];
    const rangeStartMs = convertToMs(range.start);
    const rangeEndMs = convertToMs(range.end);

    if (timestamp >= rangeStartMs && timestamp <= rangeEndMs) {
      return range.set; // Found the matching range
    } else if (timestamp < rangeStartMs) {
      right = mid - 1; // Look left
    } else {
      left = mid + 1; // Look right
    }
  }
  return null; // No matching range
}

function generateAbilityVisibility() {
  return Object.entries(abilityBatchInfo).reduce((acc, [spellId, ranges]) => {
    // Get unique set names for this spell
    const uniqueSets = [...new Set(ranges.map((range) => range.set))];

    // Create the sets object with all sets set to true
    const sets = uniqueSets.reduce((setsAcc, setName) => {
      return {
        ...setsAcc,
        [setName]: true,
      };
    }, {});

    // Add the spell ID entry to the accumulator
    acc[spellId] = {
      all: true,
      sets,
    };

    return acc;
  }, {});
}

module.exports = { findRangeForTimeStamp, generateAbilityVisibility };
