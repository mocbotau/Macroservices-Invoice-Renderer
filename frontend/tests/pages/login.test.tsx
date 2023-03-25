import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Login from "@src/pages/login";
import mockRouter from "next-router-mock";
import { DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { Api } from "@src/Api";

jest.mock("next/router", () => require("next-router-mock"));

const VALID_SESSION = {
  email: "valid@email.com",
};

beforeEach(() => {
  jest.clearAllMocks();
  DBRun("DELETE FROM Users");
  mockRouter.push("/");
});

describe("Login", () => {
  test("Renders login button", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /Login/ });
    expect(button).toBeInTheDocument();
  });
  test("Login button click - no username and no password", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /Login/ });

    await userEvent.click(button);
    expect(mockRouter).toMatchObject({
      asPath: "/",
      pathname: "/",
    });
  });

  test("Login button click - User doesn't exist", async () => {
    render(<Login />);

    const loginSpy = jest
      .spyOn(Api, "login")
      .mockResolvedValue({
        status: 404,
        json: { error: "User does not exist." },
      });

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: "password", type: "password" },
    });

    const loginButton = screen.getByRole("button", { name: /Login/ });

    await userEvent.click(loginButton);
    expect(loginSpy).toHaveBeenCalledTimes(1);

    const feedback = screen.getByText(/User does not exist\./);
    expect(feedback).toBeInTheDocument();
  });

  test("Login button click - Password incorrect", async () => {
    render(<Login />);

    const loginSpy = jest
      .spyOn(Api, "login")
      .mockResolvedValue({
        status: 403,
        json: { error: "Password is incorrect." },
      });

    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update("wrongPassword").digest("hex"),
    ]);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: user.email } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: user.password, type: "password" },
    });

    const loginButton = screen.getByRole("button", { name: /Login/ });
    await userEvent.click(loginButton);
    expect(loginSpy).toHaveBeenCalledTimes(1);

    const feedback = screen.getByText(/Password is incorrect\./);
    expect(feedback).toBeInTheDocument();
  });

  test("Login button click - Success", async () => {
    render(<Login />);

    const loginSpy = jest
      .spyOn(Api, "login")
      .mockResolvedValue({ status: 200, json: {} });

    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update(user.password).digest("hex"),
    ]);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: user.email } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: user.password, type: "password" },
    });

    const loginButton = screen.getByRole("button", { name: /Login/ });
    await userEvent.click(loginButton);

    expect(loginSpy).toHaveBeenCalledTimes(1);

    expect(mockRouter).toMatchObject({
      asPath: "/editor",
      pathname: "/editor",
    });
  });
});

describe("Register", () => {
  test("Renders register button", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /Register/ });
    expect(button).toBeInTheDocument();
  });

  test("Register button click - no username and no password", async () => {
    render(<Login />);

    const registerSpy = jest
      .spyOn(Api, "register")
      .mockResolvedValue({
        status: 400,
        json: { error: "Email/Password can not be empty." },
      });

    const button = screen.getByRole("button", { name: /Register/ });
    await userEvent.click(button);
    expect(registerSpy).toHaveBeenCalledTimes(1);

    const feedback = screen.getByText(/Email\/Password can not be empty\./);
    expect(feedback).toBeInTheDocument();
  });

  test("Register button click - Invalid email", async () => {
    render(<Login />);

    const registerSpy = jest
      .spyOn(Api, "register")
      .mockResolvedValue({
        status: 400,
        json: { error: "Email is not a valid form." },
      });

    const user = {
      email: "invalid_email",
      password: "password",
    };

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: user.email } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: user.password, type: "password" },
    });

    const registerButton = screen.getByRole("button", { name: /Register/ });
    await userEvent.click(registerButton);
    expect(registerSpy).toBeCalledTimes(1);

    const feedback = screen.getByText(/Email is not a valid form\./);
    expect(feedback).toBeInTheDocument();
  });

  test("Register button click - User already exists", async () => {
    render(<Login />);

    const registerSpy = jest
      .spyOn(Api, "register")
      .mockResolvedValue({
        status: 409,
        json: { error: "User already exists." },
      });

    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update(user.password).digest("hex"),
    ]);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: user.email } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: user.password, type: "password" },
    });

    const registerButton = screen.getByRole("button", { name: /Register/ });
    await userEvent.click(registerButton);
    expect(registerSpy).toBeCalledTimes(1);

    const feedback = screen.getByText(/User already exists\./);
    expect(feedback).toBeInTheDocument();
  });

  test("Register button click - Success", async () => {
    render(<Login />);

    const registerSpy = jest
      .spyOn(Api, "register")
      .mockResolvedValue({ status: 200, json: {} });

    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update(user.password).digest("hex"),
    ]);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: user.email } });

    const passwordInput = screen.getByLabelText("Password", { exact: false });
    fireEvent.change(passwordInput, {
      target: { value: user.password, type: "password" },
    });

    const registerButton = screen.getByRole("button", { name: /Register/ });
    await userEvent.click(registerButton);
    expect(registerSpy).toHaveBeenCalledTimes(1);

    expect(mockRouter).toMatchObject({
      asPath: "/editor",
      pathname: "/editor",
    });
  });
});
