import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Api } from "@src/Api";
import { useRouter } from "next/router";

/**
 * Home (Index) page. Will redirect to /login if already signed in. Otherwise redirect to /editor
 */
export default function Login() {
  const [textError, setTextError] = useState<string | null>(null);
  const { push } = useRouter();

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const res = await Api.login(email, password);
    if (res.status !== 200) {
      setTextError(res.json?.error || "");
    } else {
      push("/editor");
    }
  };

  const handleRegister = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const res = await Api.register(email, password);
    if (res.status !== 200) {
      setTextError(res.json?.error || "");
    } else {
      push("/editor");
    }
  };

  // Adapted from https://frontendshape.com/post/react-mui-5-login-page-example
  return (
    <>
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
              Macroservices Sign In
            </Typography>
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Email"
                data-testid="EmailField"
                id="email"
                name="email"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Password"
                data-testid="PasswordField"
                id="password"
                name="password"
                type="password"
                margin="normal"
                fullWidth
                required
              />
              <Box sx={{ float: "right" }}>
                <Button
                  type="button"
                  data-testid="RegisterButton"
                  onClick={handleRegister}
                  variant="outlined"
                  sx={{ mt: 2, ml: 2 }}
                >
                  Register
                </Button>
                <Button
                  type="submit"
                  data-testid="LoginButton"
                  variant="contained"
                  sx={{ mt: 2, ml: 2 }}
                >
                  Login
                </Button>
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
