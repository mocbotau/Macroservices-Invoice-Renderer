import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

interface ComponentProps {
  icon: JSX.Element;
  name: string;
  // onClick: Function;
}

export default function ThirdPartySignInButton(props: ComponentProps) {
  return (
    <Button
      variant="contained"
      startIcon={props.icon}
      fullWidth
      sx={{ my: 1, backgroundColor: "#292929" }}
      onClick={() => signIn("google")}
    >
      {`Sign In with ${props.name}`}
    </Button>
  );
}
