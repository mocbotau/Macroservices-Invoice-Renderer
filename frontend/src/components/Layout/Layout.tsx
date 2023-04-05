import React from "react";
import NavBar from "../NavBar";
import { Box } from "@mui/material";

type AppProps = {
  children: React.ReactNode;
};

export default function Layout(props: AppProps) {
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <NavBar />
      <main className="main">{props.children}</main>
    </Box>
  );
}
