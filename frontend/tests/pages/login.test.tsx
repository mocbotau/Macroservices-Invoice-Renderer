import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Login from "@src/pages/login";
import mockRouter from "next-router-mock";

let loginSpy: jest.SpyInstance;
jest.mock("next/router", () => require("next-router-mock"));

beforeAll(() => {
  jest.clearAllMocks();
  mockRouter.push("/");
});

describe("Login", () => {
  test("Renders login button", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /Login/i });
    expect(button).toBeInTheDocument();
  });
  test("Login button click - no username and no password", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /Login/i });

    await userEvent.click(button);
    // Didn't move as fields were empty
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
    });
  });
  test("Login button click - User doesn't exist", async () => {
    render(<Login />);

    const emailInput = screen.getByTestId("email_input");
    userEvent.type(emailInput, "test@mail.com");

    const passwordInput = screen.getByTestId("password_input");
    userEvent.type(passwordInput, "password");

    const button = screen.getByRole("button", { name: /Login/i });

    await userEvent.click(button);
    const feedback = screen.getByText(/User does not exist./); // Not working :/
    expect(feedback).toBeInTheDocument();
  });
});
