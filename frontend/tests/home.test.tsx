import { fireEvent, render, screen } from "@testing-library/react";
import Home from "@src/pages/index";
import "@testing-library/jest-dom/extend-expect";

describe("Home", () => {
  it("renders a button", () => {
    render(<Home />);

    const button = screen.getByRole("button", {
      name: /check health/i,
    });

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });
});
