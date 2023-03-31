import { Api } from "@src/Api";
import { InvoiceSendExtOptions, InvoiceSendOptions } from "@src/interfaces";
import SendHandler from "@src/pages/api/send";
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
  // sendSpy = jest.spyOn(Api, "sendInvoice");
  jest.clearAllMocks();
});

describe("/api/send route", () => {
  test("It should provide a 405 status when the request is not POST", async () => {
    const resp = await mockRequest(SendHandler, { method: "GET" });
    expect(resp.statusCode).toBe(405);
    // expect(sendSpy).toHaveBeenCalled();
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
    // expect(sendSpy).toHaveBeenCalled();
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
    // expect(sendSpy).toHaveBeenCalled();
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
    // expect(sendSpy).toHaveBeenCalled();
  });
  test("It should provide a 400 status when no contact is passed in", async () => {
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: createTestReqBody("email", undefined, "pdf", testFile),
    });
    expect(resp.statusCode).toBe(400);
    // expect(sendSpy).toHaveBeenCalled();
  });
  // test("It should provide a 400 status when the type that is passed in is invaid", async () => {
  //   const resp = await mockRequest(SendHandler, {
  //     method: "POST",
  //     headers: { "Content-Type": "multipart/form-data" },
  //     body: createTestReqBody(
  //       "invalidType",
  //       "brandon@masterofcubesau.com",
  //       "pdf",
  //       testFile
  //     ),
  //   });
  // expect(resp.statusCode).toBe(400);
  // });
  test("It should provide a 200, sending xml to sms via external api", async () => {
    let externalAPISpy: jest.SpyInstance;
    externalAPISpy = jest
      .spyOn(Api, "sendInvoiceExternal")
      .mockResolvedValue({ status: 200, json: {} });
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      body: createTestReqBody("sms", "043153253", "pdf", testFile),
    });
    expect(externalAPISpy).toBeCalled();
    expect(resp.statusCode).toBe(200);
  });
  test.only("It should provide a 200, sending xml to email via external api", async () => {
    let externalAPISpy: jest.SpyInstance;
    externalAPISpy = jest
      .spyOn(Api, "sendInvoiceExternal")
      .mockResolvedValue({ status: 200, json: {} });
    const resp = await mockRequest(SendHandler, {
      method: "POST",
      body: createTestReqBody(
        "sms",
        "brandon@masterofcubesau.com",
        "pdf",
        testFile
      ),
    });
    expect(externalAPISpy).toBeCalled();
    expect(resp.statusCode).toBe(200);
  });
});
