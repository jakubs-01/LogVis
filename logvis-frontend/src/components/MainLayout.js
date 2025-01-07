import React from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import FightSelector from "./FightList/FightSelector";
import MechanicVisualization from "./MechanicVisualization";
import { Typography } from "@mui/material";
import NotificationSnackbar from "./NotificationSnackbar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import axios from "axios";
import LoadingOverlay from "./LoadingOverlay";
const MainLayout = ({
  reportCode,
  fights,
  selectedFight,
  setSelectedFight,
  setReportCode,
  title,
  setTitle,
  setFights,
}) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const reportCodeFromQuery = query.get("reportCode");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        Close
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  React.useEffect(() => {
    const fetchData = async (code) => {
      try {
        setIsLoading(true);
        const exists = await axios.get(
          process.env.REACT_APP_TITLE_AND_AUTHOR_API_URL,
          {
            params: { reportCode: code },
            withCredentials: true,
          }
        );

        if (exists.data.title !== null) {
          setTitle(exists.data.title);
        }

        const response = await axios.get(process.env.REACT_APP_FIGHTS_API_URL, {
          params: { reportCode: code },
          withCredentials: true,
        });

        setFights(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
        handleClick();
      }
    };

    if (reportCodeFromQuery) {
      setReportCode(reportCodeFromQuery);
      fetchData(reportCodeFromQuery);
    }
  }, [reportCodeFromQuery]);

  if (!reportCode) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Please submit a report URL to continue
        </Typography>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <LoadingOverlay
        message="Loading report data..."
        width="100vw"
        height="100vh"
      />
    );
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid2 container spacing={3} sx={{ p: 2 }}>
          {/* FightSelector on the left */}
          <Grid2
            item
            xs={12}
            md={4}
            lg={3}
            sx={{
              height: { md: "calc(100vh - 100px)" },
              overflow: "auto",
            }}
          >
            {fights.length > 0 && (
              <FightSelector
                fights={fights}
                selectedFight={selectedFight}
                onFightSelect={setSelectedFight}
              />
            )}
          </Grid2>

          {/* MechanicVisualization on the right */}
          <Grid2
            item
            xs={12}
            md={8}
            lg={9}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {selectedFight && (
              <MechanicVisualization
                reportCode={reportCode}
                fight={selectedFight}
              />
            )}
          </Grid2>
        </Grid2>
        <NotificationSnackbar
          open={open}
          onClose={handleClose}
          title={title}
          success={Boolean(title)}
          action={action}
        />
      </Box>
    </>
  );
};

export default MainLayout;
