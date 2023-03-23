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
    const req = await Api.login(email, password);
    if (req.status !== 200) {
      setTextError((await req.json()).error);
    } else {
      push("/editor");
    }
  };

  const handleRegister = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    if (!(email && password)) {
      setTextError("The email and/or password field cannot be empty.");
      return;
    }
    const req = await Api.register(email, password);
    if (req.status !== 200) {
      setTextError((await req.json()).error);
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
                data-testid="email_input"
                id="email"
                name="email"
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Password"
                data-testid="password_input"
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
                  onClick={handleRegister}
                  variant="outlined"
                  sx={{ mt: 2, ml: 2 }}
                >
                  Register
                </Button>
                <Button type="submit" variant="contained" sx={{ mt: 2, ml: 2 }}>
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
