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
import LogEntry from "./LogEntry";

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
        const response = await ApiService.getLogs();
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
        const response = await ApiService.getLogs();
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
                <LogEntry key={log._id} log={log} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LogsPage;
