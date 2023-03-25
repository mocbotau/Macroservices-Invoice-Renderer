import React, { useState } from "react";
import { Api } from "@src/Api";
import { Alert, Button, Snackbar } from "@mui/material";

/**
 * Temporary home page with health status check
 */
export default function Home() {
  const [health, setHealth] = useState(0);
  const [statusShow, setStatusShow] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={async () => {
          (await Api.healthStatus()) === 200 ? setHealth(1) : setHealth(-1);
          setStatusShow(true);
        }}
        data-testid="health-check-button"
      >
        Check health
      </Button>
      <Snackbar
        open={statusShow}
        autoHideDuration={3000}
        onClose={() => setStatusShow(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {health > 0 ? (
          <Alert severity="success">Server OK</Alert>
        ) : (
          <Alert severity="error">Server down</Alert>
        )}
      </Snackbar>
    </>
  );
}
