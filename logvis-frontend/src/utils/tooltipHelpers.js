import { ClassToColour } from "../config/ClassColours";
import BossRoomMappings from "../config/bossRoomMappings";

export const formatTime = (ms) => {
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(
    Math.floor((ms % 3600000) / 60000)
  ).padStart(2, "0")}:${String(Math.floor((ms % 60000) / 1000)).padStart(
    2,
    "0"
  )}`;
};

export const generateWarcraftLogsUrl = (reportCode, fightID, timestamp) => {
  return `https://www.warcraftlogs.com/reports/${reportCode}#fight=${fightID}&view=replay&position=${timestamp}`;
};

export const generateTooltipContent = (data) => {
  if (!data) return null;
  const wowheadURL = `https://www.wowhead.com/spell=${data.abilityGameID}`;
  const replayUrl = generateWarcraftLogsUrl(
    data.reportCode,
    data.fightID,
    data.timestamp - data.fightStartTime
  );

  return (
    <div>
      <span
        style={{ color: ClassToColour(data.playerClass), fontWeight: "bold" }}
      >
        {data.playerName}
      </span>
      <br />
      <strong>Cast</strong>{" "}
      <a
        href={wowheadURL}
        target="_blank"
        rel="noopener noreferrer"
        data-wowhead={`spell=${data.abilityGameID}`}
      >
        {BossRoomMappings.getAbilityName(data.abilityGameID)}
      </a>
      <br />@{formatTime(data.timestamp - data.fightStartTime)} - Set{" "}
      {data.setnumber}
      <br />
      <a href={replayUrl} target="_blank" rel="noopener noreferrer">
        Open Replay
      </a>
    </div>
  );
};
