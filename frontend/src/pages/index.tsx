import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { DefaultSession } from "next-auth";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import BackgroundImage from "@src/components/BackgroundImage";

export interface ServerSideProps {
  user: DefaultSession["user"];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  return {
    props: { user: session?.user || null }, // will be passed to the page component as props
  };
}

function LandingPage(props: ServerSideProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(props.user ? "/dashboard" : "/login");
  };

  return (
    <>
      <BackgroundImage opacity={0.6} />
      <Box
        sx={{
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 700, color: "white" }}
          >
            Easy Invoicing for Your Business
          </Typography>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{ color: "white" }}
          >
            Send professional invoices, convert any CSV to an invoice, and get
            paid faster with our invoicing service.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, marginTop: "1rem" }}
            onClick={handleRedirect}
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>
    </>
  );
}

export default LandingPage;
