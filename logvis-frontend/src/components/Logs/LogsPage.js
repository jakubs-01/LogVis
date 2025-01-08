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
import FlagCell from "./FlagCell";

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

const LogsPage = () => {
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
        const response = await axios.get(process.env.REACT_APP_LOGS_API_URL, {
          withCredentials: true,
        });
        const data = response.data.sort(
          (a, b) =>
            new Date(b.request.timestamp) - new Date(a.request.timestamp)
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
        const response = await axios.get(process.env.REACT_APP_LOGS_API_URL, {
          withCredentials: true,
        });
        const data = response.data.sort(
          (a, b) =>
            new Date(b.request.timestamp) - new Date(a.request.timestamp)
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
      return log.response.duration / 1000 < threshold;
    }
    if (searchStr.startsWith(">")) {
      const threshold = parseFloat(searchStr.substring(1));
      return log.response.duration / 1000 > threshold;
    }
    return (
      log.request.method.toLowerCase().includes(searchStr) ||
      log.request.url.toLowerCase().includes(searchStr) ||
      new Date(log.request.timestamp)
        .toLocaleString()
        .toLowerCase()
        .includes(searchStr) ||
      log.response.statusCode.toString().includes(searchStr) ||
      log.response.duration.toString().includes(searchStr) ||
      (log.request.ip && log.request.ip.toLowerCase().includes(searchStr))
    );
  });

  if (loading) return <CircularProgress />;
  if (error && !connectionError)
    return <Alert severity="error">Error: {error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Logs
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
          label="Search logs"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by method, URL, timestamp, IP, status code, or duration..."
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
                  Method
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  URL
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Timestamp
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  IP Address
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="white" fontWeight="bold">
                  Status Code
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

export default LogsPage;
