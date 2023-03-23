import React from "react";

type AppProps = {
  children: React.ReactNode;
};

export default function Layout(props: AppProps) {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
}
