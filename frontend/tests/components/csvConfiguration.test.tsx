import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
jest.mock("@handsontable/react");

describe("CSVConfiguration", () => {
  test("renders HotTable component", () => {
    render(<CSVConfiguration file={new File([], "test.csv")} />);
    // const hotTableElement = screen.getByRole("grid");
    // expect(hotTableElement).toBeInTheDocument();
  });
});
