import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { readFileAsText, uploadFile } from "@src/utils";

/**
 * Temporary home page with health status check
 */
export default function Editor() {
  const upload = async () => {
    const f = await uploadFile(".csv");
    const fText = await readFileAsText(f);

    // TODO: Send the uploaded data to the next page
    console.log(fText);
  };

  return (
    <>
      {/* Create full height app */}
      {/* https://gist.github.com/dmurawsky/d45f068097d181c733a53687edce1919 */}
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item>
          <Typography variant="h4">INVOICE RENDERER</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={upload}>
            Upload CSV file
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
