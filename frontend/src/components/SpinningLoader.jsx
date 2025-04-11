import React from "react";
import { CircularProgress, Box } from "@mui/material";

const SpinningLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        width:'400px'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default SpinningLoader;
