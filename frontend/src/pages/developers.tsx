import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import BackgroundImage from "@src/components/BackgroundImage";

const API_DOCS_URL = "https://macroservices.masterofcubesau.com/docs";
const GETTING_STARTED_URL =
  "https://macroservices.masterofcubesau.com/docs/getting-started";

function Developers(): JSX.Element {
  return (
    <>
      <BackgroundImage opacity={0.6} />
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
}

export default Developers;
