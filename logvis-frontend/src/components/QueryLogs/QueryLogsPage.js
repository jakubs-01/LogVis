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
} from "@mui/material";
import ApiService from "../../service/ApiService";
import QueryLogEntry from "./QueryLogEntry";

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
        const response = await ApiService.getQueryLogs();

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
        const response = await ApiService.getQueryLogs();
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
                <QueryLogEntry key={log._id} log={log} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QueryLogsPage;
