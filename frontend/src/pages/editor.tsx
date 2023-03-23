import { IronSessionData } from "iron-session";
import { withIronSessionSsr } from "iron-session/next";
import { IronOptions } from "@src/../iron_session.config";
import { Alert, Button, Snackbar } from "@mui/material";
import { Api } from "@src/Api";
import { useState } from "react";
import { useRouter } from "next/router";

type PageProps = {
  user: IronSessionData["user"];
};

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: (req.session as IronSessionData).user || null,
    },
  };
}, IronOptions);

export default function Editor(props: PageProps) {
  const [textError, setTextError] = useState<string | null>(null);
  const { push } = useRouter();

  const handleLogout = async () => {
    const req = await Api.logout();
    if (req.status !== 200) {
      setTextError((await req.json()).error);
    } else {
      push("/");
    }
  };

  return (
    <>
      <p>This is the editor page. You are logged in as {props.user?.email}</p>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
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
