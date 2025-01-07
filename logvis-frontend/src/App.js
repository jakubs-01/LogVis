// src/App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogsPage from "./components/LogsPage";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar/NavBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto";
import PageNotFound from "./components/PageNotFound";
import QueryLogsPage from "./components/QueryLogsPage";
import CircularProgress from "@mui/material/CircularProgress";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import { Helmet } from "react-helmet";
import HomePage from "./components/HomePage";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import NotificationSnackbar from "./components/NotificationSnackbar";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#64b5f6",
    },
    secondary: {
      main: "#ce93d8",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

function App() {
  const [url, setUrl] = useState("");
  const [reportCode, setReportCode] = useState("");
  const [fights, setFights] = useState([]);
  const [selectedFight, setSelectedFight] = useState(null);
  const [userName, setUserName] = useState(null);
  const [title, setTitle] = React.useState("");
  const [fetchingUserName, setFetchingUserName] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

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

  return (
    <div className="App">
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <NavBar
              setReportCode={setReportCode}
              userName={userName}
              setUserName={setUserName}
              setFetchingUserName={setFetchingUserName}
              setOpen={setOpen}
              setError={setError}
              setSuccess={setSuccess}
            />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/analyze"
                element={
                  <>
                    <Helmet>
                      <title>Analyze Your Logs - LogVis</title>
                    </Helmet>
                    <MainLayout
                      reportCode={reportCode}
                      fights={fights}
                      selectedFight={selectedFight}
                      setSelectedFight={setSelectedFight}
                      setReportCode={setReportCode}
                      title={title}
                      setTitle={setTitle}
                      setFights={setFights}
                    />
                  </>
                }
              />
              <Route
                path="/logs"
                element={
                  fetchingUserName ? (
                    <CircularProgress />
                  ) : userName && userName === "Nuloa" ? (
                    <>
                      <Helmet>
                        <title>Logs - LogVis</title>
                      </Helmet>
                      <LogsPage />
                    </>
                  ) : (
                    <UnauthorizedAccess />
                  )
                }
              />
              <Route
                path="/query-logs"
                element={
                  fetchingUserName ? (
                    <CircularProgress />
                  ) : userName && userName === "Nuloa" ? (
                    <>
                      <Helmet>
                        {" "}
                        <title>Query Logs - LogVis </title>
                      </Helmet>
                      <QueryLogsPage />
                    </>
                  ) : (
                    <UnauthorizedAccess />
                  )
                }
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
          <NotificationSnackbar
            open={open}
            onClose={handleClose}
            title={title}
            success={success}
            errormessage={error}
            action={action}
          />
        </ThemeProvider>
      </React.StrictMode>
    </div>
  );
}

export default App;
