import { render } from "@testing-library/react";
import CSVConfiguration from "@src/components/csvConfiguration/CSVConfiguration";
jest.mock("@handsontable/react");

interface TableProps {
  file: File;
}

const mockCSVConfigPane = jest.fn();
const mockHotTable = jest.fn();

jest.mock("@src/components/csvConfiguration/CSVConfigurationPane", () => {
  return () => mockCSVConfigPane();
});

jest.mock("@src/components/csvConfiguration/HotTable", () => {
  const orig = jest.requireActual("@src/components/csvConfiguration/HotTable");

  return {
    __esModule: true,
    ...orig,
    HotTable: (props: TableProps) => mockHotTable(props),
  };
});

describe("CSVConfiguration", () => {
  const data = 'Name,Quantity,"Unit Price",\nApple,3,3,\n';
  const blob = new Blob([data], { type: "test/csv" });
  const file = new File([blob], "test.csv", { type: "text/csv" });

  test("renders HotTable component without error", async () => {
    render(<CSVConfiguration file={file} />);

    expect(mockCSVConfigPane).toHaveBeenCalled();
    expect(mockHotTable).toHaveBeenCalled();
  });
});
