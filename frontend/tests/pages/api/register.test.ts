import { register_handler } from "@src/pages/api/auth/register";
import { DBGet, DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { mockRequest } from "./apiTestHelper";

beforeEach(() => {
  jest.clearAllMocks();
  DBRun("DELETE From Users");
});

describe("/auth/register route", () => {
  test("It should provide a 200 OK status when a valid credential is passed", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };

    const resp = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(200);
    expect(await DBGet("SELECT Email, Password FROM Users")).toBeDefined();
  });
  test("It should provide a 400 status when email is empty", async () => {
    const user = {
      email: "",
      password: "password",
    };

    const resp = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 400 status when password is empty", async () => {
    const user = {
      email: "test@mail.com",
      password: "",
    };

    const resp = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(400);
  });
  test("It should provide a 400 status when the email is an invalid form", async () => {
    const user = {
      email: "test",
      password: "password",
    };

    const resp = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(400);
  });
  test("409 when user already exists", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };

    // await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
    //   user.email,
    //   createHash("sha256").update(user.password).digest("hex"),
    // ]);

    const resp = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    const resp2 = await mockRequest(register_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp2.statusCode).toBe(409);
  });
  test("It should provide a 405 bad method status when not POST", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update(user.password).digest("hex"),
    ]);

    const resp = await mockRequest(register_handler, {
      method: "GET",
    });
    expect(resp.statusCode).toBe(405);
  });
});
