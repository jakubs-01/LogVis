import React from "react";
import { Typography, Container } from "@mui/material";

const UnauthorizedAccess = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20%" }}>
      <Typography variant="h1" component="h1" gutterBottom>
        401
      </Typography>
      <Typography variant="h4" component="h2">
        Unauthorized Access
      </Typography>
    </Container>
  );
};

export default UnauthorizedAccess;
