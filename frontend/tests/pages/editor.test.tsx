import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Editor, { serverSideProps } from "@src/pages/editor";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";
import { Api } from "@src/Api";

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

beforeEach(() => {
  jest.clearAllMocks();
  mockRouter.push("/");
});

describe("Editor Page", () => {
  test("No valid session", () => {
    render(<Editor user={undefined} />);
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
    });
  });
  test("Valid session", () => {
    render(<Editor user={VALID_SESSION} />);
    const feedback = screen.getByText(
      `This is the editor page. You are logged in as ${VALID_SESSION.email}`
    );
    expect(feedback).toBeInTheDocument();
  });
  test("Render logout button", () => {
    render(<Editor user={VALID_SESSION} />);
    const button = screen.getByRole("button", { name: /Logout/ });
    expect(button).toBeInTheDocument();
  });
  test("Logout button click - success", async () => {
    render(<Editor user={VALID_SESSION} />);
    const logoutSpy = jest
      .spyOn(Api, "logout")
      .mockResolvedValue({ status: 200 });

    const button = screen.getByRole("button", { name: /Logout/ });
    await userEvent.click(button);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
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
