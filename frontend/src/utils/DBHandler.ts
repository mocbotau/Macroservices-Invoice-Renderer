import sqlite3 from "sqlite3";

const DB = new sqlite3.Database("./persistence/database.db");

DB.serialize(() => {
  DB.run(
    "CREATE TABLE IF NOT EXISTS 'Users' ('ID' INTEGER NOT NULL UNIQUE, 'Email' TEXT NOT NULL, 'Password' TEXT NOT NULL, PRIMARY KEY('ID' AUTOINCREMENT))"
  );
});

export async function DBRun(query: string, ...params: any[]): Promise<void> {
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
  ...params: any[]
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
