import { Button, Grid, Typography, Box } from "@mui/material";
import { SetStateType } from "@src/interfaces";
import { Snackbar } from "./Snackbar";
import { useEffect, useState } from "react";

interface ComponentProps {
  setSnackbarMessage: SetStateType<string>;
  snackbarMessage: string;
  handleUpload: () => Promise<void>;
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
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        message={props.snackbarMessage}
      />

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
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
