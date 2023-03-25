import { withIronSessionSsr } from "iron-session/next";
import { IronOptions } from "@src/../iron_session.config";
import { User } from "../../additional";

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => await serverSideProps(req.session.user),
  IronOptions
);

export async function serverSideProps(user?: User) {
  return {
    props: {
      user: user || null,
    },
  };
}

/**
 * Home (Index) page. Will redirect to /login if already signed in. Otherwise redirect to /editor
 */
export default function Home() {
  return <></>;
}
