import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ExportOptionsPanel from "@src/components/exportOptionsPanel";
import { Api } from "@src/Api";

const mockDownloadFile = jest.fn();

jest.mock("@src/utils", () => {
  return {
    downloadFile: (data: Blob, fname: string) => mockDownloadFile(data, fname),
  };
});

beforeEach(() => {
  jest.restoreAllMocks();
  mockDownloadFile.mockClear();
});

const UBL = "FAKE UBL";

describe("exportOptionsPanel", () => {
  it("renders without crashing", () => {
    render(<ExportOptionsPanel ubl={UBL} />);
  });

  it("hides language and style options when selecting JSON output type", async () => {
    render(<ExportOptionsPanel ubl={UBL} />);

    expect(screen.getByTestId("language-form")).toBeVisible();
    expect(screen.getByTestId("style-form")).toBeVisible();

    fireEvent.mouseDown(
      within(screen.getByTestId("output-type-form")).getByRole("button")
    );
    fireEvent.click(await screen.findByTestId("json-option"));

    expect(screen.getByTestId("language-form")).not.toBeVisible();
    expect(screen.getByTestId("style-form")).not.toBeVisible();
  });

  it.each([
    ["pdf", true, "download"],
    ["pdf", true, "send"],
    ["pdf", false, "download"],
    ["pdf", false, "send"],
    ["html", true, "download"],
    ["html", true, "send"],
    ["html", false, "download"],
    ["html", false, "send"],
    ["json", true, "download"],
    ["json", true, "send"],
    ["json", false, "download"],
    ["json", false, "send"],
    ["xml", true, "download"],
    ["xml", true, "send"],
  ])(
    "exporting %s has a %p success status (%s)",
    async (outType, isSuccessful, exportMethod) => {
      const sendInvoiceSpy = jest
        .spyOn(Api, "sendInvoice")
        .mockResolvedValue({ status: 200 });
      const sendInvoiceExternalSpy = jest
        .spyOn(Api, "sendInvoiceExternal")
        .mockResolvedValue({ status: 200 });

      render(<ExportOptionsPanel ubl={UBL} />);

      fireEvent.mouseDown(
        within(screen.getByTestId("export-method-form")).getByRole("button")
      );
      fireEvent.click(await screen.findByTestId(`${exportMethod}-option`));

      if (exportMethod === "send") {
        fireEvent.change(
          screen.getByTestId("recipient-textfield").querySelector("input"),
          { target: { value: "test@test.com" } }
        );
      }

      fireEvent.mouseDown(
        within(screen.getByTestId("output-type-form")).getByRole("button")
      );
      fireEvent.click(await screen.findByTestId(`${outType}-option`));

      if (outType !== "json" && outType !== "xml") {
        fireEvent.mouseDown(
          within(screen.getByTestId("language-form")).getByRole("button")
        );
        fireEvent.click(await screen.findByTestId("spanish-option"));

        fireEvent.mouseDown(
          within(screen.getByTestId("style-form")).getByRole("button")
        );
        fireEvent.click(await screen.findByTestId("style-option-2"));
      }

      const blob = new Blob(["test data"]);

      const methodMapping: Record<
        string,
        "renderToHTML" | "renderToJSON" | "renderToPDF"
      > = {
        html: "renderToHTML",
        json: "renderToJSON",
        pdf: "renderToPDF",
      };

      let spy;
      if (outType !== "xml") {
        spy = jest
          .spyOn(Api, methodMapping[outType])
          .mockResolvedValue({ status: isSuccessful ? 200 : 400, blob });
      }

      fireEvent.click(screen.getByTestId("export-button"));

      await waitFor(() => {
        if (outType !== "xml") {
          if (outType === "json") {
            expect(spy).toHaveBeenCalledWith(UBL);
          } else {
            expect(spy).toHaveBeenCalledWith(UBL, 2, "es", {});
          }
        }
        if (isSuccessful) {
          if (exportMethod === "download") {
            expect(mockDownloadFile).toHaveBeenCalledWith(
              blob,
              expect.stringMatching(new RegExp(`\\.${outType}$`))
            );
          }
        } else {
          expect(mockDownloadFile).not.toHaveBeenCalled();
        }
      });
    }
  );
});
