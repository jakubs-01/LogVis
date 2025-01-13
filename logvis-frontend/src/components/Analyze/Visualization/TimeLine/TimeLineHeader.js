import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import BossRoomMappings from "../../../../config/bossRoomMappings";

const TimeLineHeader = ({
  abilityIds,
  selectedAbility,
  handleAbilityChange,
}) => {
  return (
    <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
      <ToggleButtonGroup
        value={selectedAbility}
        exclusive
        onChange={handleAbilityChange}
        aria-label="ability selection"
        size="small" // Added size small
      >
        {abilityIds.map((abilityId) => (
          <ToggleButton
            key={abilityId}
            value={abilityId}
            sx={{
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5, // Reduced from 1
              "&.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.12)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.2)",
                },
              },
            }}
          >
            <img
              src={BossRoomMappings.getAbilityIcon(abilityId)}
              alt=""
              style={{
                width: 20, // Reduced from 24
                height: 20, // Reduced from 24
                filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
              }}
            />
            {BossRoomMappings.getAbilityName(abilityId)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeLineHeader;
