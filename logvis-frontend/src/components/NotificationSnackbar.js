import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const NotificationSnackbar = ({
  open,
  onClose,
  title,
  success,
  errormessage,
  action,
}) => (
  <Snackbar
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    message={
      <span style={{ display: "flex", alignItems: "center" }}>
        {success ? (
          <CheckCircleIcon style={{ color: "#80e666", marginRight: 8 }} />
        ) : (
          <ErrorIcon style={{ color: "#e68066", marginRight: 8 }} />
        )}
        {success ? `${title} loaded successfully` : title || errormessage}
      </span>
    }
    action={action}
    sx={{
      "& .MuiSnackbarContent-root": {
        backgroundColor: "#333",
        color: "#fff",
      },
    }}
  />
);

NotificationSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  success: PropTypes.bool.isRequired,
  action: PropTypes.node,
};

export default NotificationSnackbar;
