import React, { useState } from "react";
import { Box, Grid, TextField, Typography, Card, Button } from "@mui/material";
import { Api } from "@src/Api";
import { LoadingButton } from "@mui/lab";
import { NextSeo } from "next-seo";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { SetStateType } from "@src/interfaces";

interface ComponentProps {
  setShowResetPassword: SetStateType<boolean>;
}

export default function RequestResetPassword(props: ComponentProps) {
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetInitiated, setResetInitiated] = useState(false);

  const handleReset = async (event: React.SyntheticEvent) => {
    setLoadingReset(true);
    event.preventDefault();
    const email = (document.getElementById("resetEmail") as HTMLInputElement)
      ?.value;
    await Api.requestResetPassword(email);
    setLoadingReset(false);
    setResetInitiated(true);
  };

  return (
    <>
      <NextSeo title="Reset Password" />
      <Grid width="100%">
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!resetInitiated ? (
            <Box component="form" onSubmit={handleReset} width="100%">
              <TextField
                label="Email"
                data-testid="resetEmailField"
                id="resetEmail"
                name="email"
                margin="normal"
                fullWidth
                required
              />
              <LoadingButton
                type="submit"
                data-testid="ResetButton"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                loading={loadingReset}
              >
                Reset Password
              </LoadingButton>
            </Box>
          ) : (
            <Card
              variant="outlined"
              sx={{ mt: 3, p: 5, display: "flex", flexDirection: "column" }}
            >
              <MailOutlineIcon
                sx={{ alignSelf: "center", mb: 3, fontSize: 50 }}
              />
              <Typography>
                If this email is associated with an account, a password reset
                email will be sent shortly.
              </Typography>
            </Card>
          )}
          <Grid container sx={{ marginTop: 2 }}>
            <Grid item xs>
              <Button
                variant="text"
                onClick={() => props.setShowResetPassword(false)}
              >
                Return to log in
              </Button>
            </Grid>
            <Grid item></Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
