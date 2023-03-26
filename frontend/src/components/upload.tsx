import { Button, Grid, Typography, Alert, Snackbar } from "@mui/material";

interface ComponentProps {
  setSnackbarMessage: (value: string) => void;
  snackbarMessage: string;
  handleUpload: () => Promise<void>;
}

export default function Upload(props: ComponentProps) {
  return (
    <>
      <Snackbar
        open={props.snackbarMessage.length !== 0}
        autoHideDuration={3000}
        onClose={() => props.setSnackbarMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" data-testid="health-check-success">
          {props.snackbarMessage}
        </Alert>
      </Snackbar>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item>
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
    </>
  );
}
