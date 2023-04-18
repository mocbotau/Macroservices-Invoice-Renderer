import { Container, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import BackgroundImage from "@src/components/BackgroundImage";

function FourOFour() {
  const router = useRouter();

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
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: "white" }}
          >
            404 Not Found
          </Typography>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{ color: "white" }}
          >
            {"We lost this page :("}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, marginTop: "1rem" }}
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </Container>
      </Box>
    </>
  );
}

export default FourOFour;
