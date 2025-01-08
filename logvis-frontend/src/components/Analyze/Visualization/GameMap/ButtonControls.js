import { Button, Stack } from "@mui/material";

const ButtonControls = ({
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  swapMapAnsurek,
  isAnsurek,
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        padding: 1.5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 2,
        backdropFilter: "blur(5px)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Button
        variant="contained"
        size="small"
        onClick={handleZoomIn}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        Zoom In
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={handleZoomOut}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        Zoom Out
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={handleResetZoom}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        Reset Zoom
      </Button>

      {isAnsurek && (
        <Button variant="contained" size="small" onClick={swapMapAnsurek}>
          Swap Map
        </Button>
      )}
    </Stack>
  );
};

export default ButtonControls;
