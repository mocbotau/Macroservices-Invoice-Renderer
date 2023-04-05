import { Alert, Snackbar as SnackbarOriginal } from "@mui/material";
import { SetStateType } from "@src/interfaces";

interface ComponentProps {
  showSnackbar: boolean;
  setShowSnackbar: SetStateType<boolean>;
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

/**
 * Renders a snackbar component
 *
 * @param {ComponentProps} props - the props required for the component
 * @returns {JSX.Element} - the returned element
 */
export const Snackbar = (props: ComponentProps): JSX.Element => {
  const { showSnackbar, setShowSnackbar, message, severity } = props;

  return (
    <SnackbarOriginal
      open={showSnackbar}
      autoHideDuration={3000}
      onClose={() => setShowSnackbar(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} data-testid="error-snackbar">
        {message}
      </Alert>
    </SnackbarOriginal>
  );
};
