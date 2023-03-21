import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Home from "@src/pages/index";
import { Api } from "@src/Api";

let healthSpy: jest.SpyInstance;

beforeAll(() => {
  jest.clearAllMocks();
});

describe("Home", () => {
  it("renders a button", async () => {
    healthSpy = jest.spyOn(Api, "healthStatus").mockImplementation(async () => {
      return 200;
    });

    render(<Home />);

    const button = screen.getByRole("button", {
      name: /check health/i,
    });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(healthSpy).toHaveBeenCalled();

    const feedback = screen.getByText(/server ok/i);
    expect(feedback).toBeInTheDocument();
  });
});
