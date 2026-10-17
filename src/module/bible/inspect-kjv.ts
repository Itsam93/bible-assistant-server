import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "bible",
  "kjv.sqlite",
);

console.log("Opening database:");
console.log(databasePath);

const database = new Database(
  databasePath,
  {
    readonly: true,
  },
);

try {
  const tables = database
    .prepare(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        ORDER BY name
      `,
    )
    .all();

  console.log("\nTables:");
  console.table(tables);

  const columns = database
    .prepare(
      `
        PRAGMA table_info(verses)
      `,
    )
    .all();

  console.log("\nVerses table:");
  console.table(columns);

  const bookCounts = database
    .prepare(
      `
        SELECT
          book_id,
          COUNT(*) AS verse_count
        FROM verses
        GROUP BY book_id
        ORDER BY book_id
      `,
    )
    .all();

  console.log("\nBook IDs:");
  console.table(bookCounts);

  const john316 = database
    .prepare(
      `
        SELECT
          id,
          book_id,
          chapter,
          number,
          text
        FROM verses
        WHERE book_id = 43
          AND chapter = 3
          AND number = 16
      `,
    )
    .all();

  console.log("\nSample John 3:16:");
  console.table(john316);
} finally {
  database.close();
}