import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ClassToColour, ClassToIcon } from "../config/ClassColours";
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
  // First group events by abilityGameID, with error handling
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [abilityIds, setAbilityIds] = useState([]);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [notSorted, setNotSorted] = useState(true);

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
    console.log("events: ", events);
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
    console.log("Sorted");
  }, [events]);

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
          acc[event.setnumber].push(formattedEvent);
          return acc;
        }, {})
      : {};

    // Sort events within each set by timestamp
    Object.values(grouped).forEach((setEvents) => {
      setEvents.sort((a, b) => a.timestamp - b.timestamp);
    });

    setGroupedEvents(grouped);
    console.log("Grouped events:", grouped);
    setNotSorted(false);
  }, [selectedAbility, events]);

  if (
    !events ||
    events.length === 0 ||
    !bossName ||
    notSorted ||
    abilityIds.length === 0
  )
    return <div>.</div>;
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
                src={BossRoomMappings.getAbilityIcon(abilityId)}
                alt=""
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              {BossRoomMappings.getAbilityName(abilityId)}
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
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      borderRadius: 2,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "background.paper",
                    }}
                  >
                    {setEvents.map((event, eventIndex) => (
                      <Box
                        key={eventIndex}
                        sx={{
                          mb: eventIndex !== setEvents.length - 1 ? 2 : 0,
                          display: "flex",
                          position: "relative",
                          flexDirection: "column",
                          borderBottom:
                            eventIndex !== setEvents.length - 1
                              ? "1px solid rgba(0, 0, 0, 0.12)"
                              : "none",
                          pb: eventIndex !== setEvents.length - 1 ? 2 : 0,
                        }}
                      >
                        <Box
                          sx={{
                            flexGrow: 1,
                            position: "relative",
                            zIndex: 1,
                            backgroundColor: "#121212",
                            borderRadius: 1,
                            p: 1,
                          }}
                        >
                          <Typography
                            variant="h7"
                            color="textSecondary"
                            sx={{
                              mb: 1,
                              fontWeight: "medium",
                            }}
                          >
                            {event.formattedTime}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                            }}
                          >
                            {replacePlaceHolders(
                              BossRoomMappings.getAbilityDescription(
                                event.abilityGameID
                              ),
                              event.playerName,
                              event.playerClass
                            )}
                          </Typography>
                        </Box>
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
