import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import BossRoomMappings from "../config/bossRoomMappings";
import { useEffect } from "react";

const TimeLineVisualization = ({ events = [], bossName, fightStartTime }) => {
  console.log("Received events:", events);
  console.log("Events type:", typeof events);
  console.log("Is events an array?", Array.isArray(events));
  console.log("bossName: ", bossName);
  // First group events by abilityGameID, with error handling
  const eventsByAbility = Array.isArray(events)
    ? events.reduce((acc, event) => {
        if (!acc[event.abilityGameID]) {
          acc[event.abilityGameID] = [];
        }
        acc[event.abilityGameID].push(event);
        return acc;
      }, {})
    : {};

  console.log("Grouped events:", eventsByAbility);

  // Get list of unique ability IDs
  const abilityIds = Object.keys(eventsByAbility);
  console.log("Ability IDs:", abilityIds);

  // State to track which ability timeline to show
  const [selectedAbility, setSelectedAbility] = useState(abilityIds[0]);

  // Group selected ability events by set number
  const groupedEvents =
    selectedAbility && eventsByAbility[selectedAbility]
      ? eventsByAbility[selectedAbility].reduce((acc, event) => {
          if (!acc[event.setnumber]) {
            acc[event.setnumber] = [];
          }
          acc[event.setnumber].push(event);
          return acc;
        }, {})
      : {};

  console.log("Grouped events by set:", groupedEvents);

  // Sort events within each set by timestamp
  Object.values(groupedEvents).forEach((setEvents) => {
    setEvents.sort((a, b) => a.timestamp - b.timestamp);
  });

  const getClassColor = (playerClass) => {
    const classColors = {
      Rogue: "#FFF569",
      Hunter: "#ABD473",
      Paladin: "#F58CBA",
      Warlock: "#9482C9",
      Druid: "#FF7D0A",
      Evoker: "#33937F",
      Mage: "#69CCF0",
      DemonHunter: "#A330C9",
      Priest: "#FFFFFF",
      Warrior: "#C79C6E",
      Shaman: "#0070DE",
    };
    return classColors[playerClass] || "#FFFFFF";
  };

  const formatTimestamp = (timestamp) => {
    const correctTime = timestamp - fightStartTime;
    const seconds = Math.floor(correctTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAbilityChange = (event, newAbility) => {
    if (newAbility !== null) {
      setSelectedAbility(newAbility);
    }
  };

  useEffect(() => {
    setSelectedAbility(abilityIds[0] || null);
  }, [bossName, abilityIds]);

  if (!abilityIds || !bossName) return <div>No ability IDs found</div>;
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "auto",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={selectedAbility}
          exclusive
          onChange={handleAbilityChange}
          aria-label="ability selection"
        >
          {abilityIds.map((abilityId) => (
            <ToggleButton
              key={abilityId}
              value={abilityId}
              sx={{
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={BossRoomMappings.getAbilityIcon(bossName, abilityId)}
                alt=""
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              {BossRoomMappings.getAbilityName(bossName, abilityId)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: "400px", overflow: "auto" }}>
        <Timeline
          position="alternate"
          sx={{
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0.2,
            },
          }}
        >
          {Object.entries(groupedEvents).map(
            ([setNumber, setEvents], index) => (
              <TimelineItem key={setNumber}>
                <TimelineOppositeContent>
                  <Typography variant="h6" color="textSecondary">
                    {setNumber.toUpperCase()}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    {setEvents.map((event, eventIndex) => (
                      <Box
                        key={eventIndex}
                        sx={{ mb: eventIndex !== setEvents.length - 1 ? 1 : 0 }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: getClassColor(event.playerClass),
                            fontWeight: "bold",
                          }}
                        >
                          {event.playerName} ({event.playerClass})
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Time: {formatTimestamp(event.timestamp)}
                        </Typography>
                        {eventIndex !== setEvents.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </Box>
                    ))}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            )
          )}
        </Timeline>
      </Box>
    </Box>
  );
};

export default TimeLineVisualization;
