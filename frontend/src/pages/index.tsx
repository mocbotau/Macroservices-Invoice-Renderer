import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { DefaultSession } from "next-auth";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

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
    router.push(props.user ? "/editor" : "/login");
  };

  return (
    <>
      <Paper
        sx={{
          zIndex: "-1000",
          backgroundColor: "#111",
          position: "absolute",
          height: "calc(100% - 70px)",
          width: "100%",
        }}
      />
      <Image
        src="#"
        loader={() => {
          return "https://picsum.photos/1920/1080";
        }}
        alt={"Background"}
        priority
        fill
        style={{
          zIndex: "-999",
          boxShadow: "0 0 200px rgba(0,0,0,0.99) inset",
          filter: "blur(5px) opacity(0.6)",
          objectFit: "cover",
        }}
      />
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
