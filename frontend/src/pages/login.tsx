import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LoginImage from "../../public/D-6Zm37U0AAgVR7-2.jpg";
import Image from "next/image";
import {
  Alert,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Tab,
  Tabs,
  Button,
} from "@mui/material";
import { Api } from "@src/Api";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { NextSeo } from "next-seo";
import { TabPanel } from "@src/components/TabPanel";
import * as EmailValidator from "email-validator";
import { GitHub, Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import RequestResetPassword from "@src/components/Login/RequestResetPassword";
import GoogleIcon from "@mui/icons-material/Google";
import ThirdPartySignInButton from "@src/components/Login/ThirdPartySignInButton";
import { PASSWORD_MIN_LENGTH } from "@src/constants";

export default function SignInSide() {
  const [textError, setTextError] = useState<string | null | undefined>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loginEmailError, setLoginEmailError] = useState("");
  const [registerNameError, setRegisterNameError] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const { push } = useRouter();

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const email = (document.getElementById("login_email") as HTMLInputElement)
      ?.value;
    const password = (
      document.getElementById("login_password") as HTMLInputElement
    )?.value;

    // client-side validation
    if (!email || !EmailValidator.validate(email)) {
      setLoginEmailError("Please enter a valid email.");
      return;
    }

    setLoadingLogin(true);

    // server-side validation
    await signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/dashboard",
      redirect: false,
    }).then((res) => {
      if (res.status !== 200) {
        setTextError("Invalid credentials.");
        setLoadingLogin(false);
      } else {
        push("/dashboard");
      }
    });
  };

  const handleRegister = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    let errorCondition = false;

    const email = (
      document.getElementById("register_email") as HTMLInputElement
    )?.value;
    const password = (
      document.getElementById("register_password") as HTMLInputElement
    )?.value;
    const name = (document.getElementById("register_name") as HTMLInputElement)
      ?.value;

    // client-side validation
    if (!email || !EmailValidator.validate(email)) {
      setRegisterEmailError("Please enter a valid email.");
      errorCondition = true;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setRegisterPasswordError("Password must be at least 6 characters.");
      errorCondition = true;
    }
    if (name.length === 0) {
      setRegisterNameError("This field is required.");
      errorCondition = true;
    }
    if (errorCondition) {
      return;
    }

    setLoadingRegister(true);

    // server-side validation
    const res = await Api.register(email, password, name);
    if (res.status !== 200) {
      setTextError(res.json?.error);
      setLoadingRegister(false);
    } else {
      await signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: "/dashboard",
        redirect: false,
      }).then((res) => {
        if (res.status !== 200) {
          setTextError("Something went wrong. Please try again later.");
          setLoadingRegister(false);
        } else {
          push("/dashboard");
        }
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <NextSeo title="Login" />
      <Grid container height="100%">
        <Grid item xs={false} sm={false} md={7}>
          <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={LoginImage}
              alt="Login image"
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={5} component={Paper}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100%" }}
          >
            <Grid item xs={3} width="50%">
              {showResetPassword ? (
                <RequestResetPassword
                  setShowResetPassword={setShowResetPassword}
                />
              ) : (
                <>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ paddingBottom: 2 }}
                  >
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </Tabs>
                  <TabPanel value={tabValue} index={0}>
                    <Typography component="h1" variant="h5">
                      Welcome Back!
                    </Typography>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleLogin}
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={loginEmailError.length > 0}
                        helperText={loginEmailError}
                        id="login_email"
                        label="Email Address"
                        name="login_email"
                        autoComplete="email"
                        autoFocus
                        onFocus={() => setLoginEmailError("")}
                      />
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginY: 2 }}
                      >
                        <InputLabel htmlFor="login_password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="login_password"
                          label="Password"
                          autoComplete="current-password"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        data-testid="LoginButton"
                        fullWidth
                        variant="contained"
                        sx={{ my: 2 }}
                        loading={loadingLogin}
                      >
                        Login
                      </LoadingButton>
                      <ThirdPartySignInButton
                        icon={<GoogleIcon />}
                        name="Google"
                      />
                      <ThirdPartySignInButton icon={<GitHub />} name="GitHub" />
                      <Grid container>
                        <Grid item xs>
                          <Button
                            variant="text"
                            onClick={() => setShowResetPassword(true)}
                          >
                            Forgot password?
                          </Button>
                        </Grid>
                        <Grid item></Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <Typography component="h1" variant="h5">
                      Welcome!
                    </Typography>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleRegister}
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={registerNameError.length > 0}
                        helperText={registerNameError}
                        onFocus={() => setRegisterNameError("")}
                        id="register_name"
                        label="Name"
                        name="register_name"
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        error={registerEmailError.length > 0}
                        helperText={registerEmailError}
                        onFocus={() => setRegisterEmailError("")}
                        id="register_email"
                        label="Email Address"
                        name="register_email"
                        autoComplete="email"
                      />
                      <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{ marginY: 2 }}
                      >
                        <InputLabel htmlFor="register_password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="register_password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          error={registerPasswordError.length > 0}
                          onFocus={() => setRegisterPasswordError("")}
                          autoComplete="current-password"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText
                          error={registerPasswordError.length > 0}
                        >
                          {registerPasswordError}
                        </FormHelperText>
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        data-testid="RegisterButton"
                        fullWidth
                        variant="contained"
                        sx={{ my: 2 }}
                        loading={loadingRegister}
                      >
                        Register
                      </LoadingButton>
                    </Box>
                  </TabPanel>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
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
