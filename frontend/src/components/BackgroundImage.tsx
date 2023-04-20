import { Paper } from "@mui/material";
import Image from "next/image";

function BackgroundImage(props: { opacity: number }) {
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
          filter: `blur(5px) opacity(${props.opacity})`,
          objectFit: "cover",
        }}
      />
    </>
  );
}

export default BackgroundImage;
