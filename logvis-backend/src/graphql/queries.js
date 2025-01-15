const QUERIES = {
  FETCH_TITLE_AND_AUTHOR: `query GetTitleAndAuthor($reportCode: String!) { reportData { report(code: $reportCode) { title owner { name } } } }`,
  FETCH_FIGHTS: `query GetFights($reportCode: String!) { reportData { report(code: $reportCode) { fights { id encounterID startTime endTime name difficulty bossPercentage kill lastPhase } } } }`,
  FETCH_FIGHT_STARTTIME: `query GetFightStartTime($reportCode: String!, $parsedfightID: [Int]!) { reportData { report(code: $reportCode) { fights(fightIDs: $parsedfightID) { startTime } } } }`,
  FETCH_ACTORS: `query GetActors($reportCode: String!) { reportData { report(code: $reportCode) { masterData { actors { id server name subType } } } } }`,
  FETCH_DAMAGE_EVENTS: `query DamageTakenWithCoordinates($reportCode: String!, $parsedabilityID: Float!, $parsedfightID: [Int!]) { reportData { report(code: $reportCode) { events(dataType: DamageTaken abilityID: $parsedabilityID includeResources: true fightIDs: $parsedfightID) { data nextPageTimestamp } } } }`,
  FETCH_DEBUFF_EVENTS: `query DebuffWithCoordinates($reportCode: String!, $parsedabilityID: Float!, $parsedfightID: [Int!]) { reportData { report(code: $reportCode) { events(dataType: Debuffs abilityID: $parsedabilityID includeResources: false fightIDs: $parsedfightID) { data nextPageTimestamp } } } }`,
  FETCH_CLOSEST_EVENT: `query ClosestEventWithCoordinates($reportCode: String!, $parsedstartTime: Float!, $parsedendTime: Float!, $parsedtargetID: Int!, $parsedfightID: [Int!]) { reportData { report(code: $reportCode) { events(dataType: All includeResources: true fightIDs: $parsedfightID sourceID: $parsedtargetID startTime: $parsedstartTime endTime: $parsedendTime) { data nextPageTimestamp } } } }`,
  FETCH_AUTH_USER_NAME: `query GetUserInfo { userData { currentUser{ name } } }`,
  FETCH_API_RESPONSE: `query GetResponse {__type(name: "ReportMap") { fields { name } } }`,
};

module.exports = QUERIES;
