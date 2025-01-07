import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchInput from "./SearchInput";

export default function NavBar({
  setReportCode,
  userName,
  setUserName,
  setFetchingUserName,
  setOpen,
  setError,
  setSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserName = async () => {
      setFetchingUserName(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_USER_DATA_API_URL,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUserName(response.data.userName);
          setFetchingUserName(false);
        }
      } catch (error) {
        setUserName(false);
        console.error("User not logged in", error);
        setFetchingUserName(false);
      }
    };

    fetchUserName();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChange = async (event) => {
    const code = extractReportCode(event.target.value);
    if (!code) {
      setError("Invalid report URL format");
      setSuccess(false);
      setOpen(true);
      return;
    }
    setReportCode(code);
    try {
      setIsLoading(true);
      setReportCode(code);
      // Redirect to /analyze with the report code as a query parameter
      window.location.href = `/analyze?reportCode=${code}`;
      return; // Stop execution since we're redirecting
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutRequest = async () => {
    try {
      const request = await axios.post(
        process.env.REACT_APP_USER_LOGOUT_ENDPOINT,
        {},
        {
          withCredentials: true,
        }
      );
      if (request.status === 200) {
        setUserName(false);
        window.location.href = process.env.REACT_APP_ORIGIN_URL;
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const extractReportCode = (url) => {
    if (!url) return null;

    try {
      // Handle full URLs by converting to URL object
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      const reportsIndex = pathSegments.indexOf("reports");

      if (reportsIndex !== -1 && pathSegments[reportsIndex + 1]) {
        return pathSegments[reportsIndex + 1];
      }
    } catch (e) {
      // If URL parsing fails, try regex as fallback
      const regex = /reports\/([a-zA-Z0-9]+)/i;
      const match = url.match(regex);
      return match ? match[1] : null;
    }

    return null;
  };

  const navigateTo = (path) => {
    handleMenuClose();
    window.location.href =
      path === "Home"
        ? "/"
        : path === "Charts"
        ? "/query-logs"
        : `/${path.toLowerCase()}`;
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "rgba(25, 25, 25, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ minHeight: "70px" }}>
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/logo512.png`}
            alt="Website Logo"
            sx={{
              height: "50px",
              mr: 3,
              borderRight: "1px solid rgba(255, 255, 255, 0.3)",
              pr: 3,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenuOpen} edge="start">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              {["Home", "Analyze", "Logs", "Charts"].map((text) => (
                <MenuItem key={text} onClick={() => navigateTo(text)}>
                  {text}
                </MenuItem>
              ))}
              {userName === false ? (
                <MenuItem
                  onClick={() => {
                    window.location.href =
                      process.env.REACT_APP_USER_LOGIN_ENDPOINT;
                  }}
                >
                  Login with WarcraftLogs
                </MenuItem>
              ) : userName ? (
                <MenuItem onClick={logoutRequest}>Logout</MenuItem>
              ) : null}
            </Menu>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {["Home", "Analyze", "Logs", "Charts"].map((text) => (
              <Button
                key={text}
                variant="text"
                sx={{
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigateTo(text)}
              >
                {text}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {userName === false ? (
              <Button
                variant="contained"
                sx={{
                  ml: 2,
                  backgroundColor: "#00b894",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#00a884",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s",
                }}
                onClick={() => {
                  window.location.href =
                    process.env.REACT_APP_USER_LOGIN_ENDPOINT;
                }}
              >
                Login with WarcraftLogs
              </Button>
            ) : userName ? (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Box
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {userName}
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    ml: 2,
                    backgroundColor: "#e74c3c",
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#c0392b",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                  onClick={logoutRequest}
                >
                  Logout
                </Button>
              </Box>
            ) : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: "auto",
              gap: 1,
              flexGrow: { xs: 1, md: 0 },
              ml: { xs: 2, md: "auto" },
            }}
          >
            <SearchInput onChange={handleChange} disabled={isLoading} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
