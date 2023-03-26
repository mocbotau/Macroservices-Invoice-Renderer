import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Editor from "@src/pages/editor";
import userEvent from "@testing-library/user-event";

const mockUploadFile = jest.fn();

const VALID_SESSION = {
  email: "valid@email.com",
};

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

    render(<Editor user={VALID_SESSION} />);

    const button = screen.getByTestId("csv-upload-button");
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(mockUploadFile).toHaveBeenCalled();
  });
});
