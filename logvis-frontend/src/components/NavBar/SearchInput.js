import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

const SearchInput = ({ onChange, disabled }) => (
  <TextField
    id="input-field"
    label="Report URL"
    variant="filled"
    size="small"
    onChange={onChange}
    disabled={disabled}
    sx={{
      mr: 2,
      borderRadius: 1,
      "& .MuiFilledInput-root": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
    }}
  />
);

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SearchInput;
