import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home, { serverSideProps } from "@src/pages/index";
import mockRouter from "next-router-mock";

const mockedRouter = {
  push: jest.fn(),
};
jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => mockedRouter,
}));

const VALID_SESSION = {
  email: "valid@email.com",
};

beforeAll(() => {
  jest.clearAllMocks();
});

describe("Home", () => {
  test("/ redirects to /login (if not signed in)", () => {
    render(<Home />);
    mockedRouter.push.mockImplementationOnce((url) => {
      expect(url).toBe("/login");
    });
  });

  test("/ redirects to /editor (if signed in)", () => {
    mockRouter.push("/");
    render(<Home user={VALID_SESSION} />);

    mockedRouter.push.mockImplementationOnce((url) => {
      expect(url).toBe("/editor");
    });
  });
  test("getServerSideProps with valid user", async () => {
    expect(await serverSideProps(VALID_SESSION)).toEqual({
      props: { user: VALID_SESSION },
    });
  });
  test("getServerSideProps without valid user", async () => {
    expect(await serverSideProps(undefined)).toEqual({ props: { user: null } });
  });
});
