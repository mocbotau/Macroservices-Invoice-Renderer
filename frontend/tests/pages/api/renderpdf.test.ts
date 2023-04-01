import renderpdf from "@src/pages/api/renderpdf";
import { BackendApi } from "@src/BackendApi";
import { mockRequest } from "./apiTestHelper";
import buffer from "node:buffer";

describe("renderpdf", () => {
  it("proxies to the backend api", async () => {
    const spy = jest.spyOn(BackendApi, "renderpdf").mockResolvedValue({
      blob: async () => new buffer.Blob(["testdata"]),
      headers: {
        get: (t) => "application/pdf",
      },
    } as unknown as Response);

    const testBody = { test: 123 };

    await mockRequest(renderpdf, { body: testBody });

    expect(spy).toHaveBeenCalledWith(testBody);
  });
});
