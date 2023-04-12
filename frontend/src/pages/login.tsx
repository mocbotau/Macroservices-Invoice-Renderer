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
import LoginImage from "@public/1659510338070 (1).jpg";
import Image from "next/image";
import { NextSeo } from "next-seo";

/**
 * Home (Index) page. Will redirect to /login if already signed in. Otherwise redirect to /editor
 */
export default function Login() {
  const [textError, setTextError] = useState<string | null | undefined>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const { push } = useRouter();

  const handleLogin = async (event: React.SyntheticEvent) => {
    setLoadingLogin(true);
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const res = await Api.login(email, password);
    if (res.status !== 200) {
      setTextError(res.json?.error);
      setLoadingLogin(false);
    } else {
      push("/editor");
    }
  };

  const handleRegister = async (event: React.SyntheticEvent) => {
    setLoadingRegister(true);
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const res = await Api.register(email, password);
    if (res.status !== 200) {
      setTextError(res.json?.error);
      setLoadingRegister(false);
    } else {
      push("/editor");
    }
  };

  // Adapted from https://frontendshape.com/post/react-mui-5-login-page-example
  return (
    <>
      <NextSeo title="Login" />
      <Box
        sx={{
          boxShadow: 5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#191919" : "fff",
          borderRadius: 2,
          display: "flex",
          height: "100%",
        }}
      >
        <Box sx={{ width: "60%", position: "relative " }}>
          <Image
            src={LoginImage}
            style={{ objectFit: "cover", objectPosition: "bottom" }}
            fill
            alt="Login image"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            width: "40%",
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
              <LoadingButton
                type="button"
                data-testid="RegisterButton"
                onClick={handleRegister}
                variant="outlined"
                sx={{ mt: 2, ml: 2 }}
                loading={loadingRegister}
              >
                Register
              </LoadingButton>
              <LoadingButton
                type="submit"
                data-testid="LoginButton"
                variant="contained"
                sx={{ mt: 2, ml: 2 }}
                loading={loadingLogin}
              >
                Login
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Box>
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
