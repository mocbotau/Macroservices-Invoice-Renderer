import { Alert, Snackbar as SnackbarOriginal } from "@mui/material";
import { SetStateType } from "@src/interfaces";

interface ComponentProps {
  showSnackbar: boolean;
  setShowSnackbar: SetStateType<boolean>;
  message: string;
}

/**
 * Renders a snackbar component
 *
 * @param {ComponentProps} props - the props required for the component
 * @returns {JSX.Element} - the returned element
 */
export const Snackbar = (props: ComponentProps): JSX.Element => {
  const { showSnackbar, setShowSnackbar, message } = props;

  return (
    <SnackbarOriginal
      open={showSnackbar}
      autoHideDuration={3000}
      onClose={() => setShowSnackbar(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error" data-testid="error-snackbar">
        {message}
      </Alert>
    </SnackbarOriginal>
  );
};
