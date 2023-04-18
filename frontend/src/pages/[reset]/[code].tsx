import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Api } from "@src/Api";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { NextSeo } from "next-seo";

export default function ResetPassword() {
  const [textError, setTextError] = useState<string | null | undefined>(null);
  const [loadingReset, setLoadingReset] = useState(false);
  const [matchError, setMatchError] = useState(false);

  const { query, push } = useRouter();

  const handleReset = async (event: React.SyntheticEvent) => {
    setLoadingReset(true);
    event.preventDefault();
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const confirm_password = (
      document.getElementById("confirm_password") as HTMLInputElement
    )?.value;
    if (password !== confirm_password) {
      setMatchError(true);
      setLoadingReset(false);
      return;
    } else {
      setMatchError(false);
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
      <Grid style={{ minHeight: "100vh" }}>
        <Container maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
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
                onChange={() => {
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
                margin="normal"
                helperText={matchError ? "Passwords do not match" : ""}
                error={matchError}
                onChange={() => {
                  setMatchError(false);
                }}
                fullWidth
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
