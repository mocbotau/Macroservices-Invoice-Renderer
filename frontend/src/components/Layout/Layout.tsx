import React from "react";
import NavBar from "../NavBar/NavBar";
import { Box } from "@mui/material";

type AppProps = {
  children: React.ReactNode;
};

export default function Layout(props: AppProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <main style={{ height: "calc(100vh - 70px)" }}>{props.children}</main>
    </Box>
  );
}
