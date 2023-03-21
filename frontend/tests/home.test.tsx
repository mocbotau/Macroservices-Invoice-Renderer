import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Home from "@src/pages/index";
import { Api } from "@src/api";

let healthSpy: jest.SpyInstance;

beforeAll(() => {
  healthSpy = jest.spyOn(Api, "healthStatus").mockImplementation(async () => {
    return 200;
  });
});

describe("Home", () => {
  it("renders a button", async () => {
    render(<Home />);

    const button = screen.getByRole("button", {
      name: /check health/i,
    });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(healthSpy).toHaveBeenCalled();
  });
});
