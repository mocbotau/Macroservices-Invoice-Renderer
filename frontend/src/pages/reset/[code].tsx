import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Api } from "@src/Api";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { NextSeo } from "next-seo";
import { PASSWORD_MIN_LENGTH } from "@src/constants";
import BackgroundImage from "@src/components/BackgroundImage";

export default function ResetPassword() {
  const [textError, setTextError] = useState<string | null | undefined>(null);
  const [loadingReset, setLoadingReset] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  const { query, push } = useRouter();

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#ab47bc" },
      secondary: { main: "#90caf9" },
    },
  });

  const handleReset = async (event: React.SyntheticEvent) => {
    setLoadingReset(true);
    let errorCondition = false;
    event.preventDefault();

    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const confirm_password = (
      document.getElementById("confirm_password") as HTMLInputElement
    )?.value;

    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordLengthError(true);
      setLoadingReset(false);
      errorCondition = true;
    }
    if (password !== confirm_password) {
      setMatchError(true);
      setLoadingReset(false);
      errorCondition = true;
    }
    if (errorCondition) {
      return;
    }

    const res = await Api.resetPassword(query.code as string, password);
    if (res.status !== 200) {
      setTextError(res.json?.error);
      setLoadingReset(false);
    } else {
      push("/login");
    }
  };

  return (
    <>
      <NextSeo title="Reset Password" />
      <BackgroundImage opacity={0.3} />
      <ThemeProvider theme={theme}>
        <Grid
          style={{
            display: "flex",
            minHeight: "100%",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="xs">
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                fontWeight={600}
                sx={{ color: "white" }}
              >
                Macroservices Password Reset
              </Typography>
              <Box component="form" onSubmit={handleReset}>
                <TextField
                  label="New Password"
                  data-testid="PasswordField"
                  id="password"
                  name="password"
                  type="password"
                  margin="normal"
                  helperText={
                    passwordLengthError
                      ? "Password must be at least 6 characters long."
                      : ""
                  }
                  error={passwordLengthError}
                  variant="filled"
                  onChange={() => {
                    setPasswordLengthError(false);
                    setMatchError(false);
                  }}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  data-testid="ConfirmPasswordField"
                  id="confirm_password"
                  name="password"
                  type="password"
                  variant="filled"
                  margin="normal"
                  helperText={matchError ? "Passwords do not match" : ""}
                  error={matchError}
                  onChange={() => {
                    setPasswordLengthError(false);
                    setMatchError(false);
                  }}
                  fullWidth
                  sx={{ color: "white" }}
                  required
                />
                <Box sx={{ float: "right" }}>
                  <LoadingButton
                    type="submit"
                    data-testid="ResetPasswordButton"
                    variant="contained"
                    sx={{ mt: 2, ml: 2 }}
                    loading={loadingReset}
                  >
                    Set Password
                  </LoadingButton>
                </Box>
              </Box>
            </Box>
          </Container>
        </Grid>
      </ThemeProvider>
      <Snackbar
        open={Boolean(textError)}
        autoHideDuration={3000}
        onClose={() => setTextError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning">{textError}</Alert>
      </Snackbar>
    </>
  );
}
