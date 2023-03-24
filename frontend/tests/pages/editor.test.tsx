import { render, screen } from "@testing-library/react";
import Editor from "@src/pages/editor";
import userEvent from "@testing-library/user-event";

const mockUploadFile = jest.fn();

jest.mock("@src/utils", () => {
  const orig = jest.requireActual("@src/utils");

  return {
    __esModule: true,
    ...orig,
    uploadFile: (fileType: string) => mockUploadFile(fileType),
  };
});

beforeEach(() => {
  jest.restoreAllMocks();

  mockUploadFile.mockClear();
});

describe("Upload Screen", () => {
  it("uploads a file when clicking the button", async () => {
    mockUploadFile.mockImplementation(() =>
      Promise.resolve(new File(["hello,there"], "test.csv"))
    );

    render(<Editor />);

    const button = screen.getByRole("button", {
      name: /upload csv file/i,
    });
    expect(button).toBeTruthy();

    await userEvent.click(button);

    expect(mockUploadFile).toHaveBeenCalled();
  });
});
