const normalizeCoordinates = require("../utils/coordinate-normalizer");
const WarcraftLogsAPIInstance = require("./api-service");
const abilityBatches = require("../utils/ability-batches");
/**
 * Extracts boss fights from the provided fight data.
 * @async
 * @param {Object} fightData - The fight data containing report information.
 * @returns {Promise<Array>} A promise that resolves to an array of boss fights.
 */
async function extractFights(fightData) {
  const fights = fightData.data.reportData.report.fights;
  // Optional: Filter out non-boss fights or irrelevant fights
  const bossFights = fights.filter(
    (fight) => fight.encounterID !== null && fight.bossPercentage !== null
  );
  return bossFights;
}

/**
 * Extracts valid actors from the provided actor data.
 * @async
 * @param {Object} actorData - The actor data containing report information.
 * @returns {Promise<Array>} A promise that resolves to an array of valid actors.
 */
async function extractActors(actorData) {
  const actors = actorData.data.reportData.report.masterData.actors;

  // Use a Set for O(1) lookups of invalid subTypes
  const invalidSubTypes = new Set(["Unknown", "Pet", "NPC"]);

  const validActors = actors.filter(
    (actor) => !invalidSubTypes.has(actor.subType)
  );

  return validActors;
}

/**
 * Extracts the start time of fights from the provided fight data.
 * @async
 * @param {Object} fightData - The fight data containing report information.
 * @returns {Promise<Array>} A promise that resolves to an array of fight start times.
 */
async function extractFightStartTime(fightData) {
  const startTime = fightData.data.reportData.report.fights;
  return startTime;
}

/**
 * Extracts and maps damage events from the provided event data.
 * @async
 * @param {Array} eventData - The event data containing report information.
 * @param {Object} actorData - The actor data containing report information.
 * @param {Array} fightStartTime - The start time of the fight.
 * @param {string} reportCode - The report code for the events.
 * @param {Array} regions - The regions for coordinate normalization.
 * @param {string} accessToken - The access token for API requests.
 * @returns {Promise<Array>} A promise that resolves to an array of mapped damage events.
 */
async function extractMappedDamageEvents(
  eventData,
  actorData,
  fightStartTime,
  reportCode,
  regions,
  accessToken
) {
  const mergedData = [];
  for (const item of eventData) {
    mergedData.push(item.data.reportData.report.events.data);
  }
  const damageEvents = mergedData.flat();
  const actors = await extractActors(actorData);
  const playerMap = new Map();
  actors.forEach((actor) => {
    playerMap.set(actor.id, actor);
  });

  const mappedData = await Promise.all(
    damageEvents
      .map(async (events) => {
        const player = playerMap.get(events.targetID);
        if (player) {
          //They took 0 damage so we need to approximate their position with latest resource change event
          if (events.x === undefined && events.y === undefined) {
            const rawEventData =
              await WarcraftLogsAPIInstance.fetchClosestEvent(
                reportCode,
                events.targetID,
                events.timestamp,
                events.fight,
                accessToken
              );
            const closestEvent = await extractClosestEvent(
              rawEventData,
              events.timestamp,
              events.targetID
            );
            events.x = closestEvent ? closestEvent.x : 0;
            events.y = closestEvent ? closestEvent.y : 0;
          }
          const relativeTimeStamp =
            events.timestamp - fightStartTime[0].startTime;
          const batchNumber = abilityBatches.findRangeForTimeStamp(
            events.abilityGameID,
            relativeTimeStamp
          );
          // Normalize the coordinates using the provided function
          const [normalizedX, normalizedY] = normalizeCoordinates(
            regions[0],
            regions[1],
            regions[2],
            regions[3],
            parseFloat(events.x ? events.x : closestEvent.x),
            parseFloat(events.y ? events.y : closestEvent.y)
          );

          return {
            targetID: events.targetID,
            playerName: player.name,
            playerClass: player.subType,
            x: normalizedX,
            y: normalizedY,
            facing: events.facing,
            abilityGameID: events.abilityGameID,
            timestamp: events.timestamp,
            eventtype: "damagetaken",
            setnumber: batchNumber,
          };
        }
        return null;
      })
      .filter((item) => item !== null)
  );
  return mappedData;
}

/**
 * Extracts and maps debuff events from the provided event data.
 * @async
 * @param {Array} eventData - The event data containing report information.
 * @param {Object} actorData - The actor data containing report information.
 * @param {Array} regions - The regions for coordinate normalization.
 * @param {string} reportCode - The report code for the events.
 * @param {Array} fightStartTime - The start time of the fight.
 * @param {string} accessToken - The access token for API requests.
 * @returns {Promise<Array>} A promise that resolves to an array of mapped debuff events.
 */
async function extractMappedDebuffEvents(
  eventData,
  actorData,
  regions,
  reportCode,
  fightStartTime,
  accessToken
) {
  const mergedData = [];
  for (const item of eventData) {
    mergedData.push(item.data.reportData.report.events.data);
  }
  const damageEvents = mergedData.flat();
  const actors = await extractActors(actorData);

  // Map actor IDs to actor data for quick lookups
  const playerMap = new Map();
  actors.forEach((actor) => {
    playerMap.set(actor.id, actor);
  });

  // Process each event and resolve promises using Promise.all
  const mappedData = await Promise.all(
    damageEvents.map(async (events) => {
      const player = playerMap.get(events.targetID);
      if (player && events.type === "removedebuff") {
        const rawEventData = await WarcraftLogsAPIInstance.fetchClosestEvent(
          reportCode,
          events.targetID,
          events.timestamp,
          events.fight,
          accessToken
        );
        const closestEvent = await extractClosestEvent(
          rawEventData,
          events.timestamp,
          events.targetID
        );
        const relativeTimeStamp =
          events.timestamp - fightStartTime[0].startTime;
        const batchNumber = abilityBatches.findRangeForTimeStamp(
          events.abilityGameID,
          relativeTimeStamp
        );
        if (closestEvent) {
          // Normalize the coordinates
          const [normalizedX, normalizedY] = normalizeCoordinates(
            regions[0],
            regions[1],
            regions[2],
            regions[3],
            parseFloat(closestEvent ? closestEvent.x : 0),
            parseFloat(closestEvent ? closestEvent.y : 0)
          );

          return {
            targetID: events.targetID,
            playerName: player.name,
            playerClass: player.subType,
            x: normalizedX,
            y: normalizedY,
            facing: closestEvent.facing,
            abilityGameID: events.abilityGameID,
            timestamp: events.timestamp,
            eventtype: "debuffremoved",
            setnumber: batchNumber,
          };
        }
      }
      return null;
    })
  );

  // Filter out null results after resolving all promises
  return mappedData.filter((item) => item !== null);
}

/**
 * Extracts the closest event to a given timestamp from the provided event data.
 * @async
 * @param {Object} eventData - The event data containing report information.
 * @param {number} startTime - The timestamp to find the closest event to.
 * @returns {Promise<Object>} A promise that resolves to the closest event object.
 */
async function extractClosestEvent(eventData, startTime, sourceID) {
  const events = eventData.data.reportData.report.events.data;
  //! This fix is okay for now, but may need to be changed in the future
  const filteredEvents = events.filter((event) => {
    return (
      (event.type === "resourcechange" ||
        event.type === "heal" ||
        event.type === "cast") &&
      event.x !== undefined &&
      event.y !== undefined &&
      (event.type === "heal"
        ? event.targetID === sourceID
        : event.sourceID === sourceID)
    );
  });
  let closestPoint = -1;
  let left = 0,
    right = filteredEvents.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const current = filteredEvents[mid];
    if (current.timestamp === startTime) {
      return current;
    } else if (current.timestamp < startTime) {
      left = mid + 1;
    } else {
      right = right - 1;
    }
  }
  closestPoint =
    left >= filteredEvents.length ||
    (right >= 0 &&
      Math.abs(filteredEvents[right].timestamp - startTime) <=
        Math.abs(filteredEvents[left].timestamp - startTime))
      ? right
      : left;
  if (closestPoint === -1) {
    console.log(
      "Could not find closest event for ",
      sourceID,
      " at approximately",
      startTime
    );
    return null;
  }
  console.log(filteredEvents[closestPoint]);
  return filteredEvents[closestPoint];
}

/**
 * Extracts the author and title from the provided data.
 * @async
 * @param {Object} AuthorAndTitleData - The data containing author and title information.
 * @returns {Promise<Object>} A promise that resolves to the author and title object.
 */
async function extractAuthorAndTitle(AuthorAndTitleData) {
  const AuthorAndTitle = AuthorAndTitleData.data.reportData.report;

  return AuthorAndTitle;
}

/**
 * Generates the ability visibility data.
 * @async
 * @returns {Promise<Object>} A promise that resolves to the ability visibility data.
 */
async function extractAbilityVisibility() {
  const abilityVisibility = abilityBatches.generateAbilityVisibility();
  return abilityVisibility;
}

module.exports = {
  extractFights,
  extractFightStartTime,
  extractActors,
  extractMappedDamageEvents,
  extractAuthorAndTitle,
  extractMappedDebuffEvents,
  extractClosestEvent,
  extractAbilityVisibility,
};
