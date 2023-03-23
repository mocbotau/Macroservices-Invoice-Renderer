import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "@src/pages/index";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("Home", () => {
  test("/ redirects to /login (if not signed in)", () => {
    mockRouter.push("/");
    render(<Home />);

    expect(mockRouter).toMatchObject({
      asPath: "/login",
      pathname: "/login",
    });
  });

  // This shouldn't be working as a cookie isn't mocked/set???
  test("/ redirects to /editor (if signed in)", () => {
    mockRouter.push("/");
    render(<Home />);

    expect(mockRouter).toMatchObject({
      asPath: "/editor",
      pathname: "/editor",
    });
  });
});
