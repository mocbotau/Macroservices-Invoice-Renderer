import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

interface ComponentProps {
  icon: JSX.Element;
  name: string;
}

export default function ThirdPartySignInButton(props: ComponentProps) {
  return (
    <Button
      variant="contained"
      startIcon={props.icon}
      fullWidth
      sx={{ my: 1, backgroundColor: "#292929" }}
      onClick={() => signIn(props.name.toLowerCase())}
    >
      {`Sign In with ${props.name}`}
    </Button>
  );
}
