import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import FightStatus from "./FightStatus";

const FightListItem = ({ fight, onClick, selectedFight }) => {
  const isSelected = selectedFight && selectedFight.id === fight.id;

  return (
    <ListItem
      sx={{
        backgroundColor: isSelected
          ? "rgba(25, 118, 210, 0.12)"
          : "transparent",
        borderLeft: isSelected ? "4px solid #1976d2" : "4px solid transparent",
        transition: "all 0.2s ease",
        margin: "4px 0",
        borderRadius: "4px",
        "&:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          transform: "translateX(4px)",
        },
      }}
      onClick={() => onClick(fight)}
    >
      <ListItemAvatar>
        <Avatar
          src={`https://assets.rpglogs.com/img/warcraft/bosses/${fight.encounterID}-icon.jpg`}
          alt={fight.name}
          sx={{
            border: "2px solid",
            borderColor: fight.kill ? "#4caf50" : "#e68066",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {fight.name}
          </Typography>
        }
        secondary={
          <FightStatus
            isKill={fight.kill}
            pullNumber={fight.id}
            percentage={fight.bossPercentage}
          />
        }
      />
    </ListItem>
  );
};

export default FightListItem;
