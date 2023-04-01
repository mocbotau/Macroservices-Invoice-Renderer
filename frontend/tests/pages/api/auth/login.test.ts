import { login_handler } from "@src/pages/api/auth/login";
import { DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { mockRequest } from "../apiTestHelper";

beforeEach(async () => {
  jest.clearAllMocks();
  await DBRun("DELETE From Users");
});

describe("/auth/login route", () => {
  test("It should provide a 200 OK status when a valid credential is passed", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update(user.password).digest("hex"),
    ]);

    const resp = await mockRequest(login_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(200);
  });
  test("It should provide a 403 status when a the password is invalid", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };

    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      user.email,
      createHash("sha256").update("wrongPassword").digest("hex"),
    ]);

    const resp = await mockRequest(login_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(403);
  });
  test("It should provide a 404 when the email is not found", async () => {
    const user = {
      email: "test@mail.com",
      password: "password",
    };
    const resp = await mockRequest(login_handler, {
      method: "POST",
      body: user,
    });
    expect(resp.statusCode).toBe(404);
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

    const resp = await mockRequest(login_handler, {
      method: "GET",
    });
    expect(resp.statusCode).toBe(405);
  });
});
