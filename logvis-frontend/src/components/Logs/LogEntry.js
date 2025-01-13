import React from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import FlagCell from "./FlagCell";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LogRow = ({ log }) => {
  const [open, setOpen] = React.useState(false);

  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "#2196f3"; // Blue
      case "POST":
        return "#4caf50"; // Green
      case "PUT":
        return "#ff9800"; // Orange
      case "DELETE":
        return "#f44336"; // Red
      default:
        return "inherit";
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) {
      return "#4caf50"; // Green for success
    } else if (status >= 300 && status < 400) {
      return "#ff9800"; // Orange for redirects
    } else if (status >= 400 && status < 500) {
      return "#f44336"; // Red for client errors
    } else if (status >= 500) {
      return "#9c27b0"; // Purple for server errors
    }
    return "inherit";
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          "&:nth-of-type(odd)": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.12) !important",
          },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <span
            style={{
              color: getMethodColor(log.request.method),
              fontWeight: "bold",
            }}
          >
            {log.request.method}
          </span>
        </TableCell>
        <TableCell>{log.request.url}</TableCell>
        <TableCell>
          {new Date(log.request.timestamp).toLocaleString()}
        </TableCell>
        <FlagCell ip={log.request.ip} />
        <TableCell>
          <Box
            sx={{
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: getStatusColor(log.response.statusCode),
              color: "white",
              fontWeight: "bold",
            }}
          >
            {log.response.statusCode}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Full Log Details
              </Typography>
              <Typography variant="subtitle1">Request Details:</Typography>
              <SyntaxHighlighter
                language="json"
                style={materialDark}
                customStyle={{
                  margin: "10px 0",
                  borderRadius: "4px",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(log.request, null, 2)}
              </SyntaxHighlighter>
              <Typography variant="subtitle1">Response Details:</Typography>
              <SyntaxHighlighter
                language="json"
                style={materialDark}
                customStyle={{
                  margin: "10px 0",
                  borderRadius: "4px",
                  maxHeight: "300px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(log.response, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default LogRow;
