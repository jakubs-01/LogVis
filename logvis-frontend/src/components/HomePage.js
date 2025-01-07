import React from "react";
import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import TimelineIcon from "@mui/icons-material/Timeline";
import MapIcon from "@mui/icons-material/Map";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

const Feature = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: "transform 0.2s, background-color 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
    }}
  >
    <Stack spacing={2} alignItems="center" textAlign="center">
      {icon}
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Stack>
  </Paper>
);

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 2,
            background: "linear-gradient(45deg, #64b5f6 30%, #ce93d8 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LogVis - WoW Log Analyzer
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Analyze your World of Warcraft raid logs with advanced visualization
          tools
        </Typography>

        {/* Search Input Pointer */}
        <Box sx={{ position: "relative", mb: 6 }}></Box>
      </Box>

      {/* Features Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
        }}
      >
        <Feature
          icon={<LockOpenIcon sx={{ fontSize: 40, color: "#64b5f6" }} />}
          title="Private Logs Access"
          description="Log in with your Warcraft Logs account to analyze private reports"
        />
        <Feature
          icon={<MapIcon sx={{ fontSize: 40, color: "#64b5f6" }} />}
          title="Interactive Maps"
          description="Visualize raid mechanics and positioning with our interactive maps"
        />
        <Feature
          icon={<ToggleOnIcon sx={{ fontSize: 40, color: "#64b5f6" }} />}
          title="Smart View"
          description="Toggle boss ability usage and events throughout the fight"
        />
      </Box>

      {/* Getting Started Section */}
      <Paper
        sx={{
          mt: 8,
          p: 4,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          1. Log in with your Warcraft Logs account using the button in the top
          right
        </Typography>
        <Typography variant="body1" paragraph>
          2. Copy a Warcraft Logs report URL (e.g.,
          https://www.warcraftlogs.com/reports/...)
        </Typography>
        <Typography variant="body1" paragraph>
          3. Paste the URL in the search bar above
        </Typography>
        <Typography variant="body1">
          4. Select a fight from the list and start analyzing!
        </Typography>
      </Paper>
    </Container>
  );
};

export default HomePage;
