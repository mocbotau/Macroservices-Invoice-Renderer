import { Button, useTheme } from "@mui/material";
import { signIn } from "next-auth/react";

interface ComponentProps {
  icon: JSX.Element;
  name: string;
}

export default function ThirdPartySignInButton(props: ComponentProps) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      startIcon={props.icon}
      fullWidth
      sx={{
        my: 1,
        backgroundColor: `${
          theme.palette.mode === "dark" ? "#292929" : "white"
        }`,
        color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
        ":hover": { color: "white" },
      }}
      onClick={() => signIn(props.name.toLowerCase())}
    >
      {`Sign In with ${props.name}`}
    </Button>
  );
}
