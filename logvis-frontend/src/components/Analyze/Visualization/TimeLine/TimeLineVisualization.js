import React, { useState } from "react";
import { Box } from "@mui/material";
import { ClassToColour, ClassToIcon } from "../../../../config/ClassColours";
import Timeline from "@mui/lab/Timeline";
import TimeLineSetHolder from "./TimeLineSetHolder";
import { useEffect } from "react";
import TimeLineHeader from "./TimeLineHeader";

const TimeLineVisualization = ({
  events,
  fightStartTime,
  fightID,
  reportCode,
}) => {
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [abilityIds, setAbilityIds] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [notSorted, setNotSorted] = useState(true);

  const handleAbilityChange = (event, newAbility) => {
    if (newAbility !== null) {
      setSelectedAbility(newAbility);
    }
  };

  const replacePlaceHolders = (description, playerName, playerClass) => {
    if (!description) return "";
    const parts = description.split("{placeholder}");
    return (
      <>
        {parts[0]}
        <span style={{ color: ClassToColour(playerClass) }}>{playerName}</span>
        {parts[1]}
      </>
    );
  };

  useEffect(() => {
    setNotSorted(true);
    const eventsByAbility = Array.isArray(events)
      ? events.reduce((acc, event) => {
          if (!acc[event.abilityGameID]) {
            acc[event.abilityGameID] = [];
          }
          acc[event.abilityGameID].push(event);
          return acc;
        }, {})
      : {};

    // Get list of unique ability IDs
    const uniqueAbilityIds = Object.keys(eventsByAbility);
    setAbilityIds(uniqueAbilityIds);
    // Set initial selected ability if none is selected
    if (!selectedAbility && uniqueAbilityIds.length > 0) {
      setSelectedAbility(uniqueAbilityIds[0]);
    }
    setNotSorted(false);
  }, [events, selectedAbility]);

  // Add a separate useEffect for grouping events by set number
  useEffect(() => {
    setNotSorted(true);
    if (!selectedAbility || !events.length) return;

    const eventsByAbility = events.reduce((acc, event) => {
      if (!acc[event.abilityGameID]) {
        acc[event.abilityGameID] = [];
      }
      acc[event.abilityGameID].push(event);
      return acc;
    }, {});

    const formatTimestamp = (timestamp) => {
      const correctTime = timestamp - fightStartTime;
      const seconds = Math.floor(correctTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Group selected ability events by set number
    const grouped = eventsByAbility[selectedAbility]
      ? eventsByAbility[selectedAbility].reduce((acc, event) => {
          if (!acc[event.setnumber]) {
            acc[event.setnumber] = [];
          }
          // Format timestamp before adding to group
          const formattedEvent = {
            ...event,
            formattedTime: formatTimestamp(event.timestamp),
          };
          const replayUrl = `https://www.warcraftlogs.com/reports/${reportCode}#fight=${fightID}&view=replay&position=${
            event.timestamp - fightStartTime
          }`;
          formattedEvent.replayUrl = replayUrl;
          acc[event.setnumber].push(formattedEvent);
          return acc;
        }, {})
      : {};

    // Sort events within each set by timestamp
    Object.values(grouped).forEach((setEvents) => {
      setEvents.sort((a, b) => a.timestamp - b.timestamp);
    });

    setGroupedEvents(grouped);
    setNotSorted(false);
  }, [selectedAbility, events, fightStartTime]);

  if (!events || events.length === 0 || notSorted || abilityIds.length === 0)
    return <div>.</div>;
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700, // Reduced from 800
        margin: "auto",
      }}
    >
      <TimeLineHeader
        abilityIds={abilityIds}
        selectedAbility={selectedAbility}
        handleAbilityChange={handleAbilityChange}
      />
      <Box
        sx={{
          height: "calc(100vh - 165px)",
          overflow: "auto",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.1)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Timeline
          position="alternate"
          sx={{
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0.15, // Reduced from 0.2
            },
          }}
        >
          {Object.entries(groupedEvents).map(
            ([setNumber, setEvents], index) => (
              <TimeLineSetHolder
                setNumber={setNumber}
                setEvents={setEvents}
                replacePlaceHolders={replacePlaceHolders}
              />
            )
          )}
        </Timeline>
      </Box>
    </Box>
  );
};

export default TimeLineVisualization;
