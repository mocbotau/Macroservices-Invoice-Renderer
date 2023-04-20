import sqlite3 from "sqlite3";

export const DB = new sqlite3.Database(
  process.env.NODE_ENV === "test" ? ":memory:" : "./persistence/database.db"
);

DB.serialize(() => {
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'Users' ('Identifier' TEXT PRIMARY KEY, 'Password' TEXT, 'Name' TEXT NOT NULL, GitHub BOOLEAN NOT NULL CONSTRAINT github_default DEFAULT(false), CONSTRAINT password_required CHECK ((GitHub = true) OR (Password IS NOT NULL)), CONSTRAINT name_required CHECK ((GitHub = true) OR (Name IS NOT NULL)))"
  );
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'ResetCodes' ('Email' TEXT NOT NULL, 'Code' TEXT, FOREIGN KEY('Email') REFERENCES 'Users'('Identifier') )"
  );
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'ContactDetails' ('ID' TEXT PRIMARY KEY, 'Account' TEXT NOT NULL, 'Name' TEXT NOT NULL, EmailAddress TEXT, PhoneNumber TEXT, FOREIGN KEY('Account') REFERENCES 'Users'('Identifier'), CONSTRAINT email_phone_not_null CHECK ((EmailAddress IS NOT NULL) OR (PhoneNumber IS NOT NULL)))"
  );
});

export async function DBRun(
  query: string,
  params?: (string | number | boolean)[]
): Promise<void> {
  return new Promise((res) => {
    DB.run(query, params, (err) => {
      if (err) {
        throw err;
      } else {
        res();
      }
    });
  });
}

export async function DBGet(
  query: string,
  params?: (string | number | boolean)[]
): Promise<Record<string, unknown> | undefined> {
  return new Promise((res) => {
    DB.get(query, params, (err, row) => {
      if (err) {
        throw err;
      } else {
        res(row as Record<string, unknown>);
      }
    });
  });
}

export async function DBAll(
  query: string,
  params?: (string | number | boolean)[]
): Promise<object[] | undefined> {
  return new Promise((res) => {
    DB.all(query, params, (err, row) => {
      if (err) {
        throw err;
      } else {
        res(row as object[]);
      }
    });
  });
}
