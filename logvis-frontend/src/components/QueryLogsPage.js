import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Container,
  TablePagination,
  TextField,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

const LogRow = ({ log }) => {
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

const QueryLogsPage = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [connectionError, setConnectionError] = React.useState(false);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_QUERY_LOGS_API_URL,
          {
            withCredentials: true,
          }
        );
        const data = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(data);
        setLoading(false);
        setConnectionError(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setConnectionError(err.response.status);
      }
    };

    fetchLogs();
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_QUERY_LOGS_API_URL,
          {
            withCredentials: true,
          }
        );
        const data = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(data);
        setConnectionError(false);
      } catch (err) {
        setConnectionError(err.response.status);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredLogs = logs.filter((log) => {
    const searchStr = searchTerm.toLowerCase();

    if (searchStr.startsWith("<")) {
      const threshold = parseFloat(searchStr.substring(1));
      return log.duration / 1000 < threshold;
    }
    if (searchStr.startsWith(">")) {
      const threshold = parseFloat(searchStr.substring(1));
      return log.duration / 1000 > threshold;
    }

    if (searchStr === "true" || searchStr === "false") {
      return log.fromCache.toString() === searchStr;
    }

    return (
      log.query.toLowerCase().includes(searchStr) ||
      (log.variables?.reportCode?.toLowerCase().includes(searchStr) ?? false) ||
      new Date(log.timestamp)
        .toLocaleString()
        .toLowerCase()
        .includes(searchStr) ||
      (log.duration / 1000).toFixed(4).toString().includes(searchStr)
    );
  });

  if (loading) return <CircularProgress />;
  if (error && !connectionError)
    return (
      <Alert
        severity="error"
        sx={{
          maxWidth: "md",
          mx: "auto",
          mt: 4,
          boxShadow: 2,
        }}
      >
        Error: {error}
      </Alert>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 4,
        }}
      >
        Query Logs
      </Typography>
      {connectionError && connectionError === 500 && (
        <Alert severity="warning" sx={{ mb: 3, boxShadow: 1 }}>
          Connection to server lost. Displaying last known logs. Attempting to
          reconnect...
        </Alert>
      )}
      {connectionError && connectionError === 401 && (
        <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
          You shouldn't be here!
        </Alert>
      )}
      <Box mb={3}>
        <TextField
          fullWidth
          label="Search query logs"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by query, Report Code, timestamp, Cached status, or duration..."
          sx={{
            backgroundColor: "background.paper",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell />
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Query
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Report Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Timestamp
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Cached?
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Duration (s)
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <LogRow key={log._id} log={log} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QueryLogsPage;
