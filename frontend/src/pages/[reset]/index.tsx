import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Container,
  Card,
} from "@mui/material";
import { Api } from "@src/Api";
import { LoadingButton } from "@mui/lab";
import { NextSeo } from "next-seo";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

export default function RequestResetPassword() {
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
      <NextSeo title="Password Reset" />
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
            {!resetInitiated ? (
              <Box component="form" onSubmit={handleReset}>
                <TextField
                  label="Email"
                  data-testid="resetEmailField"
                  id="resetEmail"
                  name="email"
                  margin="normal"
                  fullWidth
                  required
                />
                <Box sx={{ float: "right" }}>
                  <LoadingButton
                    type="submit"
                    data-testid="ResetButton"
                    variant="contained"
                    sx={{ mt: 2, ml: 2 }}
                    loading={loadingReset}
                  >
                    Reset Password
                  </LoadingButton>
                </Box>
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
          </Box>
        </Container>
      </Grid>
    </>
  );
}
