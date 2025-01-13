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
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const QueryLogEntry = ({ log }) => {
  const [open, setOpen] = React.useState(false);

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
          <Typography
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            {log.query.match(/query\s+(\w+)/)?.[1] || log.query}
          </Typography>
        </TableCell>
        <TableCell>
          {log.variables?.reportCode ? (
            <a
              href={`https://www.warcraftlogs.com/reports/${log.variables.reportCode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px dotted",
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {log.variables.reportCode}
            </a>
          ) : (
            <Typography color="text.secondary">-</Typography>
          )}
        </TableCell>
        <TableCell>
          <Typography>{new Date(log.timestamp).toLocaleString()}</Typography>
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: log.fromCache ? "success.light" : "error.light",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {log.fromCache ? "Yes" : "No"}
          </Box>
        </TableCell>
        <TableCell>
          <Typography
            sx={{
              fontWeight: "medium",
              color: log.duration > 5000 ? "error.main" : "text.primary",
            }}
          >
            {(log.duration / 1000).toFixed(4)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
                backgroundColor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                color="primary"
              >
                Full Log Details
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Query Details:
              </Typography>
              <SyntaxHighlighter
                language="json"
                style={materialDark}
                customStyle={{
                  margin: "10px 0",
                  borderRadius: "8px",
                  maxHeight: "300px",
                  maxWidth: "1432px",
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {JSON.stringify(log, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default QueryLogEntry;
