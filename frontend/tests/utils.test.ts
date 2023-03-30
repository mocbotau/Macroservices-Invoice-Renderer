import {
  checkBoundaries,
  convertToCellRefs,
  extractNumber,
  lettersToNumber,
  readFileAsText,
  uploadFile,
} from "@src/utils";
import { DB, DBGet, DBRun } from "@src/utils/DBHandler";

beforeEach(async () => {
  jest.clearAllMocks();
  await DBRun("DELETE FROM Users");
});

describe("uploadFile", () => {
  it("wrong file gives error", async () => {
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
    expect(uploaded).toEqual("Please upload a valid .csv file.");
  });

  it("uploads correctly", async () => {
    const testFile = new File([], "test.csv");

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

describe("lettersToNumber", () => {
  const tests = [
    ["A", 1],
    ["Z", 26],
    ["AA", 27],
    ["AB", 28],
    ["ZZ", 702],
    ["BKTXHSOGHKKE", 9007199254740991],
  ];
  test.each(tests)("given %p as argument, return %p", (arg, expectedResult) => {
    const result = lettersToNumber(arg as string);
    expect(result).toEqual(expectedResult);
  });
});

describe("convertToCellRefs", () => {
  test("invalid coordinates provided", () => {
    expect(convertToCellRefs(-1, 0, 0, 0)).toEqual("");
  });

  test("returns correctly", () => {
    expect(convertToCellRefs(0, 0, 1, 1)).toEqual("A1:B2");
  });
});

describe("checkBoundaries", () => {
  test("coordinates below 0 provided", () => {
    expect(checkBoundaries(-1, 3)).toEqual(0);
  });

  test("coordinates above max provided", () => {
    expect(checkBoundaries(3, 2)).toEqual(2);
  });

  test("returns the same value", () => {
    expect(checkBoundaries(2, 3)).toEqual(2);
  });
});

describe("extractNumber", () => {
  test("empty string returns 0", () => {
    expect(extractNumber("")).toEqual(0);
  });

  test("removed dollar sign and converted to number", () => {
    expect(extractNumber("$2.00")).toEqual(2);
  });

  test("string provided is not a number", () => {
    expect(extractNumber("owa")).toEqual(0);
  });

  test("returns the number", () => {
    expect(extractNumber("1")).toEqual(1);
  });
});
