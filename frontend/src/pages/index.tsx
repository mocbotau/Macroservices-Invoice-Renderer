import React, { useState } from "react";
import { Alert, Button, Container, Snackbar } from "@mui/material";

export default function Home() {
  const [health, setHealth] = useState(0);
  const [statusShow, setStatusShow] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={async () => {
          try {
            const resp = await fetch("/api/healthcheck", {
              method: "GET",
            });
            setHealth(1);
          } catch {
            setHealth(-1);
          }
          setStatusShow(true);
        }}
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
