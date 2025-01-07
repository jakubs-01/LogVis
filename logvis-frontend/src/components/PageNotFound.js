import React from "react";
import { Typography, Container } from "@mui/material";

const PageNotFound = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20%" }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2">
        Page Not Found
      </Typography>
    </Container>
  );
};

export default PageNotFound;
