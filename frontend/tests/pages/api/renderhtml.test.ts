import renderhtml from "@src/pages/api/renderhtml";
import { BackendApi } from "@src/BackendApi";
import { mockRequest } from "./apiTestHelper";
import buffer from "node:buffer";

describe("renderhtml", () => {
  it("proxies to the backend api", async () => {
    const spy = jest.spyOn(BackendApi, "renderhtml").mockResolvedValue({
      blob: async () => new buffer.Blob(["testdata"]),
      headers: {
        get: (t) => "text/html",
      },
    } as unknown as Response);

    const testBody = { test: 123 };

    await mockRequest(renderhtml, { body: testBody });

    expect(spy).toHaveBeenCalledWith(testBody);
  });
});
