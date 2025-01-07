import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledStatus = styled(Typography)(({ theme, iskill }) => ({
  color: iskill === "true" ? "#80e666" : "#e68066",
}));

const FightStatus = ({ isKill, pullNumber, percentage }) => (
  <StyledStatus iskill={isKill.toString()}>
    Pull {pullNumber} - {isKill ? "Kill" : `Wipe (${percentage}%)`}
  </StyledStatus>
);

export default FightStatus;
