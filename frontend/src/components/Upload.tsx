import { Button, Grid, Typography, Box, Snackbar, Alert } from "@mui/material";
import { SetStateType } from "@src/interfaces";
import { useEffect, useState } from "react";

interface ComponentProps {
  setSnackbarMessage: SetStateType<string>;
  snackbarMessage: string;
  handleCSVUpload: () => Promise<void>;
  handleUBLUpload: () => Promise<void>;
}

/**
 * Function which renders the upload component
 *
 * @param {ComponentProps} props - the required props for the upload component
 * @returns {JSX.Element} - returns the completed uploaded component
 */
export default function Upload(props: ComponentProps): JSX.Element {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (props.snackbarMessage.length !== 0) {
      setShowSnackbar(true);
    }
  }, [props.snackbarMessage]);

  return (
    <Box>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false);
          props.setSnackbarMessage("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" data-testid="error-snackbar">
          {props.snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        height="100%"
      >
        <Grid item>
          <Typography variant="h4">INVOICE RENDERER</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={props.handleCSVUpload}
            data-testid="csv-upload-button"
            sx={{ margin: 1 }}
          >
            Upload CSV file
          </Button>
          <Button
            variant="outlined"
            onClick={props.handleUBLUpload}
            data-testid="ubl-upload-button"
            sx={{ margin: 1 }}
          >
            Upload UBL file
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
