import { DB, DBGet, DBRun } from "@src/utils/DBHandler";

beforeEach(async () => {
  await DBRun("DELETE FROM Users");
});

describe("DB Util functions", () => {
  test("DBRun and DBGet", async () => {
    DB.serialize(async () => {
      expect(async () => {
        await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
          "a",
          "b",
        ]);
      }).not.toThrowError();
      expect(await DBGet("SELECT Email, Password FROM Users")).toMatchObject({
        Email: "a",
        Password: "b",
      });
    });
  });
});
