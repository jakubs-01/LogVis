import { Typography, Paper } from "@mui/material";

import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimeLineEvent from "./TimeLineEvent";

const TimeLineSetHolder = ({ setNumber, setEvents, replacePlaceHolders }) => {
  return (
    <TimelineItem key={setNumber}>
      <TimelineOppositeContent>
        <Typography
          variant="subtitle1" // Changed from h6
          color="textSecondary"
          sx={{
            fontWeight: 500,
            textShadow: "0 0 10px rgba(255,255,255,0.1)",
          }}
        >
          {setEvents[0].formattedTime}
          <Typography
            component="span"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              px: 0.75, // Reduced from 1
              py: 0.25, // Reduced from 0.5
              borderRadius: 1,
              ml: 0.5, // Reduced from 1
              fontSize: "0.75em", // Reduced from 0.8em
            }}
          >
            Set {setNumber.substring(3)}
          </Typography>
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            boxShadow: "0 0 10px rgba(25,118,210,0.5)",
            background: "linear-gradient(45deg, #1976d2, #90caf9)",
          }}
        />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Paper
          elevation={3}
          sx={{
            p: 1.5, // Reduced from 2
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            backgroundColor: "background.paper",
          }}
        >
          {setEvents.map((event, eventIndex) => (
            <TimeLineEvent
              event={event}
              eventIndex={eventIndex}
              setEvents={setEvents}
              replacePlaceHolders={replacePlaceHolders}
            />
          ))}
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

export default TimeLineSetHolder;
