import React from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";

const API_DOCS_URL = "https://macroservices.masterofcubesau.com/docs";
const GETTING_STARTED_URL =
  "https://macroservices.masterofcubesau.com/docs/getting-started";

const Developers: React.FC = () => {
  return (
    <>
      <Paper
        sx={{
          zIndex: "-1000",
          backgroundColor: "#111",
          position: "absolute",
          height: "calc(100% - 70px)",
          width: "100%",
        }}
      />
      <Image
        src="#"
        loader={() => {
          return "https://picsum.photos/1920/1080";
        }}
        alt={"Background"}
        priority
        fill
        style={{
          zIndex: "-999",
          boxShadow: "0 0 200px rgba(0,0,0,0.99) inset",
          filter: "blur(5px) opacity(0.6)",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            gutterBottom
            fontWeight={600}
            sx={{ color: "white" }}
          >
            Welcome to the Developers Portal!
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ my: 2, color: "white" }}
          >
            Here, you can find the documentation to our API, as well as a
            getting started guide.
          </Typography>
          <Grid container spacing={3} sx={{ paddingX: 3 }}>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href={API_DOCS_URL}
                target="_blank"
              >
                Swagger Documentation
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href={GETTING_STARTED_URL}
                target="_blank"
              >
                Getting Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Developers;
