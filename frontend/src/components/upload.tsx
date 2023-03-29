import { Button, Grid, Typography, Alert, Snackbar, Box } from "@mui/material";

interface ComponentProps {
  setSnackbarMessage: (value: string) => void;
  snackbarMessage: string;
  handleUpload: () => Promise<void>;
}

export default function Upload(props: ComponentProps) {
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Snackbar
        open={props.snackbarMessage.length !== 0}
        autoHideDuration={3000}
        onClose={() => props.setSnackbarMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" data-testid="wrong-file-type">
          {props.snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
        spacing={4}
      >
        <Grid item xs={3}>
          <Typography variant="h4">INVOICE RENDERER</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={props.handleUpload}
            data-testid="csv-upload-button"
          >
            Upload CSV file
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
