import "@testing-library/jest-dom/extend-expect";
import { serverSideProps } from "@src/pages/index";

const VALID_SESSION = {
  email: "valid@email.com",
};

describe("Home", () => {
  test("getServerSideProps with valid user", async () => {
    expect(await serverSideProps(VALID_SESSION)).toEqual({
      props: { user: VALID_SESSION },
    });
  });
  test("getServerSideProps without valid user", async () => {
    expect(await serverSideProps(undefined)).toEqual({ props: { user: null } });
  });
});
