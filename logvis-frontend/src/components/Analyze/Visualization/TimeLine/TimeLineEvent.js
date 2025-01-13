import { Box, Typography } from "@mui/material";
import { ClassToColour, ClassToIcon } from "../../../../config/ClassColours";
import BossRoomMappings from "../../../../config/bossRoomMappings";

const TimeLineEvent = ({
  event,
  eventIndex,
  setEvents,
  replacePlaceHolders,
}) => {
  return (
    <Box
      key={eventIndex}
      sx={{
        mb: eventIndex !== setEvents.length - 1 ? 1.5 : 0, // Reduced from 2
        display: "flex",
        position: "relative",
        flexDirection: "column",
        borderBottom:
          eventIndex !== setEvents.length - 1
            ? "1px solid rgba(255,255,255,0.05)"
            : "none",
        pb: eventIndex !== setEvents.length - 1 ? 1.5 : 0, // Reduced from 2
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(18,18,18,0.95)",
          borderRadius: 1,
          p: 1.25, // Reduced from 1.5
          display: "flex",
          gap: 1.5, // Reduced from 2
          alignItems: "flex-start",
        }}
      >
        <img
          src={ClassToIcon(event.playerClass)}
          alt={event.playerClass}
          style={{
            width: 20, // Reduced from 24
            height: 20, // Reduced from 24
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.2))",
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{
              mb: 0.25, // Reduced from 0.5
              fontWeight: "medium",
              display: "flex",
              alignItems: "center",
              gap: 0.5, // Reduced from 1
            }}
          >
            <a href={event.replayUrl} target="_blank">
              {event.formattedTime}
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.4, // Reduced from 1.6
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {replacePlaceHolders(
              BossRoomMappings.getAbilityDescription(event.abilityGameID),
              event.playerName,
              event.playerClass
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeLineEvent;
