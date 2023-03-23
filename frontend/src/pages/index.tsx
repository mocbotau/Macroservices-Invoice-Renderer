import { IronSessionData } from "iron-session";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IronOptions } from "@src/../iron_session.config";

type PageProps = {
  user?: IronSessionData["user"];
};

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: (req.session as IronSessionData).user || null,
    },
  };
}, IronOptions);

/**
 * Home (Index) page. Will redirect to /login if already signed in. Otherwise redirect to /editor
 */
export default function Home(props: PageProps) {
  const { push } = useRouter();
  useEffect(() => {
    push(props.user ? "/editor" : "/login");
  }, [props.user, push]);
  return <></>;
}
