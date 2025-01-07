// components/LoadingOverlay.jsx
import { CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const OverlayContainer = styled(Box)(({ width, height }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: width,
  height: height,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(8px)",
  animation: "fadeIn 0.3s ease-in-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const LoadingOverlay = ({ message, width, height }) => (
  <OverlayContainer width={width} height={height}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        animation: "pulse 2s infinite",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: "white",
          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
        }}
      />
      <Box
        sx={{
          mt: 2,
          color: "white",
          fontSize: "1.1rem",
          fontWeight: 500,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {message}
      </Box>
    </Box>
  </OverlayContainer>
);

export default LoadingOverlay;
