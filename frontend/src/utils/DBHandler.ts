import sqlite3 from "sqlite3";

export const DB = new sqlite3.Database(
  process.env.NODE_ENV === "test" ? ":memory:" : "./persistence/database.db"
);

DB.serialize(() => {
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'Users' ('ID' INTEGER NOT NULL UNIQUE, 'Email' TEXT NOT NULL, 'Password' TEXT NOT NULL, PRIMARY KEY('ID' AUTOINCREMENT))"
  );
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'ResetCodes'('Email' TEXT NOT NULL, 'Code' TEXT, FOREIGN KEY('Email') REFERENCES 'Users'('Email') )"
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
