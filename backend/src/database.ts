import sqlite3 from "sqlite3";

// Use in memory database when testing
const db = new sqlite3.Database(
  process.env.NODE_ENV === "test" ? ":memory:" : "./persistence/database.db"
);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS ApiKeys (key TEXT NOT NULL PRIMARY KEY)");
});

export async function dbRun(query: string, ...params): Promise<void> {
  return new Promise((res) => {
    db.run(query, params, (err) => {
      if (err) {
        throw err;
      } else {
        res();
      }
    });
  });
}

export async function dbGet(
  query: string,
  ...params
): Promise<Record<string, any> | undefined> {
  return new Promise((res) => {
    db.get(query, params, (err, row) => {
      if (err) {
        throw err;
      } else {
        res(row);
      }
    });
  });
}
