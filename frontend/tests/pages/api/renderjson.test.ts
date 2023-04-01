import renderjson from "@src/pages/api/renderjson";
import { BackendApi } from "@src/BackendApi";
import { mockRequest } from "./apiTestHelper";
import buffer from "node:buffer";

describe("renderjson", () => {
  it("proxies to the backend api", async () => {
    const spy = jest.spyOn(BackendApi, "renderjson").mockResolvedValue({
      blob: async () => new buffer.Blob(["testdata"]),
      headers: {
        get: (t) => "application/json",
      },
    } as unknown as Response);

    const testBody = { test: 123 };

    await mockRequest(renderjson, { body: testBody });

    expect(spy).toHaveBeenCalledWith(testBody);
  });
});
