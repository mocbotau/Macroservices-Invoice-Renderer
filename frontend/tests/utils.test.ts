import { readFileAsText, uploadFile } from "@src/utils";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("uploadFile", () => {
  it("uploads files correctly", async () => {
    const testFile = new File([], "test.txt");

    const createMock = jest.spyOn(document, "createElement").mockImplementation(
      (tagName) =>
        ({
          onchange: function (e: Event) {},
          click: function () {
            this.onchange({ target: { files: [testFile] } });
          },
        } as any)
    );

    const uploaded = await uploadFile(".csv");

    expect(createMock).toHaveBeenCalled();
    expect(uploaded).toEqual(testFile);
  });
});

describe("readFileAsText", () => {
  it("uploads files correctly", async () => {
    const testFile = new File(["testdata"], "test.txt");

    const read = await readFileAsText(testFile);

    expect(read).toEqual("testdata");
  });
});
