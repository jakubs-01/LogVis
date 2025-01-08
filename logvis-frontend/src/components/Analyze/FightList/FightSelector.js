import { Paper, List, Box } from "@mui/material";
import FightListItem from "./FightListItem";

const FightSelector = ({ fights, selectedFight, onFightSelect }) => {
  if (!fights.length) {
    return null;
  }

  return (
    <Box>
      <Paper
        square
        sx={{
          maxHeight: "calc(100vh - 65px)",
          maxWidth: 500,
          overflowY: "scroll",
          backgroundColor: "background.paper",
        }}
      >
        <List dense>
          {fights.map((fight) => (
            <FightListItem
              key={fight.id}
              fight={fight}
              onClick={onFightSelect}
              selectedFight={selectedFight}
            />
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FightSelector;
