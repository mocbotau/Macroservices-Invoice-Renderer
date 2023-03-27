import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { readFileAsText, uploadFile } from "@src/utils";
import { IronSessionData } from "iron-session";

type PageProps = {
  user: IronSessionData["user"];
};

/**
 * Editor page. Holds all stages starting from upload => edit => render.
 */
// eslint-disable-next-line
export default function Editor(props: PageProps) {
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
          <Button
            variant="contained"
            onClick={upload}
            data-testid="csv-upload-button"
          >
            Upload CSV file
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
