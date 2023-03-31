import { Api } from "@src/Api";
import { InvoiceSendExtOptions, InvoiceSendOptions } from "@src/interfaces";
import SendHandler, { handleSending } from "@src/pages/api/send";
import { mockRequest } from "./apiTestHelper";

const testFile = new Blob(["This is some test data"]);

const createTestReqBody = (
  type?: InvoiceSendOptions,
  contact?: string,
  ext?: InvoiceSendExtOptions,
  file?: Blob
) => {
  const reqBody = new FormData();
  reqBody.append("type", type as InvoiceSendOptions);
  reqBody.append("contact", contact as string);
  reqBody.append("ext", ext as InvoiceSendExtOptions);
  reqBody.append("file", file as Blob);
  return reqBody;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("/api/send route", () => {
  test("It should provide a 405 status when the request is not POST", async () => {
    const resp = await mockRequest(SendHandler, { method: "GET" });
    expect(resp.statusCode).toBe(405);
  });
  test("It should provide a 400 status when no extension is passed in", async () => {
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: createTestReqBody(
        "email",
        "brandon@masterofcubesau.com",
        undefined,
        testFile
      ),
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 400 status when no type is passed in", async () => {
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: createTestReqBody(
        undefined,
        "brandon@masterofcubesau.com",
        "pdf",
        testFile
      ),
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 400 status when no file is passed in", async () => {
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: createTestReqBody(
        "email",
        "brandon@masterofcubesau.com",
        "pdf",
        undefined
      ),
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 400 status when no contact is passed in", async () => {
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: createTestReqBody("email", undefined, "pdf", testFile),
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 200, sending xml to sms via external api", async () => {
    let externalAPISpy: jest.SpyInstance;
    externalAPISpy = jest
      .spyOn(Api, "sendInvoiceExternal")
      .mockResolvedValue({ status: 200, json: {} });
    const resp = await handleSending(
      "brandon@masterofcubesau.com",
      "sms",
      "xml",
      { buffer: new Buffer([testFile]) }
    );
    expect(externalAPISpy).toBeCalled();
    expect(resp.status).toBe(200);
  });
  test("It should provide a 200, sending xml to email via external api", async () => {
    let externalAPISpy: jest.SpyInstance;
    externalAPISpy = jest
      .spyOn(Api, "sendInvoiceExternal")
      .mockResolvedValue({ status: 200, json: {} });
    const resp = await handleSending(
      "brandon@masterofcubesau.com",
      "email",
      "xml",
      { buffer: new Buffer([testFile]) }
    );
    expect(externalAPISpy).toBeCalled();
    expect(resp.status).toBe(200);
  });
  test("It should provide a 200, sending pdf to email via our sending api", async () => {
    const resp = await handleSending(
      "brandon@masterofcubesau.com",
      "email",
      "pdf",
      { buffer: new Buffer([testFile]) }
    );
    expect(resp.status).toBe(200);
  });
  test("It should provide a 200, sending html to email via our sending api", async () => {
    const resp = await handleSending(
      "brandon@masterofcubesau.com",
      "email",
      "html",
      { buffer: new Buffer([testFile]) }
    );
    expect(resp.status).toBe(200);
  });
  test("It should provide a 200, sending json to email via our sending api", async () => {
    const resp = await handleSending(
      "brandon@masterofcubesau.com",
      "email",
      "json",
      { buffer: new Buffer([testFile]) }
    );
    expect(resp.status).toBe(200);
  });
});
