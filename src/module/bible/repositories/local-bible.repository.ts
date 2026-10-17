import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

import type {
  BiblePassage,
  BibleVerse,
} from "../bible.types";

import type {
  BibleRepository,
} from "./bible.repository";

import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
} from "../bible.data";

interface KJVVerseRow {
  chapter: number;
  number: number;
  text: string;
}

interface StandardVerseRow {
  chapter: number;
  verse: number;
  text: string;
}

type DatabaseSchema =
  | "KJV"
  | "STANDARD";

interface TranslationDatabase {
  database: Database.Database;
  schema: DatabaseSchema;
  filePath: string;
}

interface BibleTextSearchResult {
  verse: BibleVerse;
  score: number;
}

export class LocalBibleRepository
  implements BibleRepository
{
  private readonly databases =
    new Map<string, TranslationDatabase>();

  constructor() {
    this.initializeDatabases();
  }

  /**
   * --------------------------------------------------
   * Initialize local Bible databases
   * --------------------------------------------------
   */
  private initializeDatabases(): void {
    for (
      const translation of BIBLE_TRANSLATIONS
    ) {
      const databasePath =
        this.getDatabasePath(
          translation.databaseId,
        );

      if (!databasePath) {
        console.warn(
          `[BibleRepository] Database not found for ${translation.id}.`,
        );

        continue;
      }

      try {
        const database =
          new Database(
            databasePath,
            {
              readonly: true,
            },
          );

        const schema =
          this.detectDatabaseSchema(
            database,
          );

        if (!schema) {
          console.warn(
            `[BibleRepository] Unsupported database schema: ${databasePath}`,
          );

          database.close();

          continue;
        }

        this.databases.set(
          translation.id.toUpperCase(),
          {
            database,
            schema,
            filePath: databasePath,
          },
        );

        console.log(
          `[BibleRepository] Loaded ${translation.id} from ${databasePath} (${schema})`,
        );
      } catch (error) {
        console.error(
          `[BibleRepository] Failed to open ${translation.id}:`,
          error,
        );
      }
    }
  }

  /**
   * --------------------------------------------------
   * Resolve SQLite database path
   * --------------------------------------------------
   *
   * Supports the common locations used by this
   * project:
   *
   *   sources/kjv.sqlite
   *   sources/asv.sqlite
   *   sources/ha_con.sqlite
   *
   *   src/data/bible/kjv.sqlite
   *   src/data/bible/asv.sqlite
   *   src/data/bible/ha_con.sqlite
   *
   *   data/bible/kjv.sqlite
   *   data/bible/asv.sqlite
   *   data/bible/ha_con.sqlite
   *
   * The first existing file is used.
   */
  private getDatabasePath(
    databaseId: string,
  ): string | null {
    const normalized =
      databaseId
        .trim()
        .toLowerCase();

    if (!normalized) {
      return null;
    }

    const root =
      process.cwd();

    const candidates = [
      path.join(
        root,
        "sources",
        `${normalized}.sqlite`,
      ),

      path.join(
        root,
        "sources",
        `${normalized}.db`,
      ),

      path.join(
        root,
        "src",
        "data",
        "bible",
        `${normalized}.sqlite`,
      ),

      path.join(
        root,
        "src",
        "data",
        "bible",
        `${normalized}.db`,
      ),

      path.join(
        root,
        "data",
        "bible",
        `${normalized}.sqlite`,
      ),

      path.join(
        root,
        "data",
        "bible",
        `${normalized}.db`,
      ),

      path.join(
        root,
        "bible",
        `${normalized}.sqlite`,
      ),

      path.join(
        root,
        "bible",
        `${normalized}.db`,
      ),
    ];

    for (
      const candidate of candidates
    ) {
      if (
        fs.existsSync(candidate)
      ) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * --------------------------------------------------
   * Detect SQLite schema
   * --------------------------------------------------
   */
  private detectDatabaseSchema(
    database: Database.Database,
  ): DatabaseSchema | null {
    const tables =
      database
        .prepare(
          `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = 'verses'
            LIMIT 1
          `,
        )
        .all() as Array<{
        name: string;
      }>;

    if (
      tables.length === 0
    ) {
      return null;
    }

    const columns =
      database
        .prepare(
          `
            PRAGMA table_info(verses)
          `,
        )
        .all() as Array<{
        name: string;
      }>;

    const columnNames =
      new Set(
        columns.map(
          (column) =>
            column.name.toLowerCase(),
        ),
      );

    /*
     * KJV schema:
     *
     * book_id
     * chapter
     * number
     * text
     */
    if (
      columnNames.has("book_id") &&
      columnNames.has("number") &&
      columnNames.has("chapter") &&
      columnNames.has("text")
    ) {
      return "KJV";
    }

    /*
     * Standard schema:
     *
     * book
     * chapter
     * verse
     * text
     */
    if (
      columnNames.has("book") &&
      columnNames.has("chapter") &&
      columnNames.has("verse") &&
      columnNames.has("text")
    ) {
      return "STANDARD";
    }

    return null;
  }

  /**
   * --------------------------------------------------
   * Find translation
   * --------------------------------------------------
   */
  private getTranslation(
    translationId: string,
  ) {
    const normalized =
      translationId
        .trim()
        .toLowerCase();

    return BIBLE_TRANSLATIONS.find(
      (translation) =>
        translation.id
          .toLowerCase() ===
        normalized,
    );
  }

  /**
   * --------------------------------------------------
   * Find Bible book
   * --------------------------------------------------
   */
  private getBook(
    bookId: string,
  ) {
    const normalized =
      bookId
        .trim()
        .toLowerCase();

    return BIBLE_BOOKS.find(
      (book) =>
        book.id.toLowerCase() ===
        normalized,
    );
  }

  /**
   * --------------------------------------------------
   * Find Bible book by database ID
   * --------------------------------------------------
   */
  private getBookByDatabaseId(
    databaseBookId: number,
  ) {
    return BIBLE_BOOKS.find(
      (book) =>
        book.databaseId ===
        databaseBookId,
    );
  }

  /**
   * --------------------------------------------------
   * Get translation database
   * --------------------------------------------------
   */
  private getDatabase(
    translationId: string,
  ): TranslationDatabase | null {
    const normalized =
      translationId
        .trim()
        .toUpperCase();

    return (
      this.databases.get(
        normalized,
      ) ?? null
    );
  }

  /**
   * --------------------------------------------------
   * Normalize Bible text
   * --------------------------------------------------
   */
  private normalizeSearchText(
    text: string,
  ): string {
    return text
      .toLowerCase()
      .replace(
        /[’‘`]/g,
        "'",
      )
      .replace(
        /[^a-z0-9\s']/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim();
  }

  /**
   * --------------------------------------------------
   * Tokenize Bible text
   * --------------------------------------------------
   */
  private getSearchTokens(
    text: string,
  ): string[] {
    const normalized =
      this.normalizeSearchText(
        text,
      );

    if (!normalized) {
      return [];
    }

    return normalized
      .split(" ")
      .map(
        (token) =>
          token.trim(),
      )
      .filter(Boolean);
  }

  /**
   * --------------------------------------------------
   * Calculate spoken-text match score
   * --------------------------------------------------
   */
  private calculateTextMatchScore(
    spokenText: string,
    verseText: string,
  ): number {
    const spoken =
      this.normalizeSearchText(
        spokenText,
      );

    const verse =
      this.normalizeSearchText(
        verseText,
      );

    if (
      !spoken ||
      !verse
    ) {
      return 0;
    }

    /*
     * Exact match.
     */
    if (
      spoken === verse
    ) {
      return 1000;
    }

    /*
     * Spoken phrase occurs inside verse.
     */
    if (
      verse.includes(spoken)
    ) {
      return (
        900 +
        Math.min(
          spoken.length,
          100,
        )
      );
    }

    const spokenTokens =
      this.getSearchTokens(
        spoken,
      );

    const verseTokens =
      this.getSearchTokens(
        verse,
      );

    if (
      spokenTokens.length < 3 ||
      verseTokens.length === 0
    ) {
      return 0;
    }

    const verseTokenSet =
      new Set(
        verseTokens,
      );

    let matchedTokens = 0;

    for (
      const token of spokenTokens
    ) {
      if (
        verseTokenSet.has(token)
      ) {
        matchedTokens += 1;
      }
    }

    const overlapRatio =
      matchedTokens /
      spokenTokens.length;

    if (
      matchedTokens < 3 ||
      overlapRatio < 0.6
    ) {
      return 0;
    }

    /*
     * Find longest contiguous sequence.
     */
    let longestSequence = 0;

    for (
      let spokenIndex = 0;
      spokenIndex <
      spokenTokens.length;
      spokenIndex += 1
    ) {
      for (
        let verseIndex = 0;
        verseIndex <
        verseTokens.length;
        verseIndex += 1
      ) {
        if (
          spokenTokens[
            spokenIndex
          ] !==
          verseTokens[
            verseIndex
          ]
        ) {
          continue;
        }

        let sequenceLength = 0;

        while (
          spokenIndex +
              sequenceLength <
            spokenTokens.length &&
          verseIndex +
              sequenceLength <
            verseTokens.length &&
          spokenTokens[
            spokenIndex +
              sequenceLength
          ] ===
            verseTokens[
              verseIndex +
                sequenceLength
            ]
        ) {
          sequenceLength += 1;
        }

        longestSequence =
          Math.max(
            longestSequence,
            sequenceLength,
          );
      }
    }

    return (
      overlapRatio * 100 +
      longestSequence * 25 +
      matchedTokens
    );
  }

  /**
   * --------------------------------------------------
   * Search spoken Bible text
   * --------------------------------------------------
   */
  searchVerseText(
    translationId: string,
    text: string,
  ): BibleVerse | null {
    const translation =
      this.getTranslation(
        translationId,
      );

    if (!translation) {
      return null;
    }

    const database =
      this.getDatabase(
        translation.id,
      );

    if (!database) {
      return null;
    }

    const searchText =
      text.trim();

    if (
      !searchText ||
      this.getSearchTokens(
        searchText,
      ).length < 3
    ) {
      return null;
    }

    let rows:
      Array<{
        bookId: number;
        chapter: number;
        verse: number;
        text: string;
      }>;

    if (
      database.schema ===
      "KJV"
    ) {
      rows =
        database.database
          .prepare(
            `
              SELECT
                book_id AS bookId,
                chapter,
                number AS verse,
                text
              FROM verses
            `,
          )
          .all() as Array<{
          bookId: number;
          chapter: number;
          verse: number;
          text: string;
        }>;
    } else {
      rows =
        database.database
          .prepare(
            `
              SELECT
                book AS bookId,
                chapter,
                verse,
                text
              FROM verses
            `,
          )
          .all() as Array<{
          bookId: number;
          chapter: number;
          verse: number;
          text: string;
        }>;
    }

    let bestMatch:
      | BibleTextSearchResult
      | null = null;

    for (
      const row of rows
    ) {
      const numericBookId =
        Number(row.bookId);

      if (
        !Number.isInteger(
          numericBookId,
        )
      ) {
        continue;
      }

      const book =
        this.getBookByDatabaseId(
          numericBookId,
        );

      if (!book) {
        continue;
      }

      const score =
        this.calculateTextMatchScore(
          searchText,
          row.text,
        );

      if (
        score <= 0
      ) {
        continue;
      }

      const verse: BibleVerse =
        {
          translationId:
            translation.id,

          bookId:
            book.id,

          bookName:
            book.name,

          chapter:
            row.chapter,

          verse:
            row.verse,

          text:
            row.text,
        };

      if (
        !bestMatch ||
        score >
          bestMatch.score
      ) {
        bestMatch = {
          verse,
          score,
        };
      }
    }

    if (
      !bestMatch ||
      bestMatch.score < 70
    ) {
      return null;
    }

    return bestMatch.verse;
  }

  /**
   * --------------------------------------------------
   * Get single verse
   * --------------------------------------------------
   */
  getVerse(
    translationId: string,
    bookId: string,
    chapter: number,
    verse: number,
  ): BibleVerse | null {
    const translation =
      this.getTranslation(
        translationId,
      );

    if (!translation) {
      return null;
    }

    const book =
      this.getBook(
        bookId,
      );

    if (!book) {
      return null;
    }

    const database =
      this.getDatabase(
        translation.id,
      );

    if (!database) {
      return null;
    }

    if (
      database.schema ===
      "KJV"
    ) {
      return this.getKJVVerse(
        database.database,
        translation.id,
        book.id,
        book.name,
        book.databaseId,
        chapter,
        verse,
      );
    }

    return this.getStandardVerse(
      database.database,
      translation.id,
      book.id,
      book.name,
      book.databaseId,
      chapter,
      verse,
    );
  }

  /**
   * --------------------------------------------------
   * Get Bible passage
   * --------------------------------------------------
   */
  getPassage(
    translationId: string,
    bookId: string,
    chapter: number,
    startVerse?: number,
    endVerse?: number,
  ): BiblePassage | null {
    const translation =
      this.getTranslation(
        translationId,
      );

    if (!translation) {
      return null;
    }

    const book =
      this.getBook(
        bookId,
      );

    if (!book) {
      return null;
    }

    const database =
      this.getDatabase(
        translation.id,
      );

    if (!database) {
      return null;
    }

    const firstVerse =
      startVerse ?? 1;

    const lastVerse =
      endVerse ??
      firstVerse;

    if (
      !Number.isInteger(
        chapter,
      ) ||
      chapter < 1 ||
      !Number.isInteger(
        firstVerse,
      ) ||
      !Number.isInteger(
        lastVerse,
      ) ||
      firstVerse < 1 ||
      lastVerse <
        firstVerse
    ) {
      return null;
    }

    const verses =
      database.schema ===
      "KJV"
        ? this.getKJVPassageVerses(
            database.database,
            translation.id,
            book.id,
            book.name,
            book.databaseId,
            chapter,
            firstVerse,
            lastVerse,
          )
        : this.getStandardPassageVerses(
            database.database,
            translation.id,
            book.id,
            book.name,
            book.databaseId,
            chapter,
            firstVerse,
            lastVerse,
          );

    if (
      verses.length === 0
    ) {
      return null;
    }

    const actualStartVerse =
      verses[0].verse;

    const actualEndVerse =
      verses[
        verses.length - 1
      ].verse;

    const reference =
      actualStartVerse ===
      actualEndVerse
        ? `${book.name} ${chapter}:${actualStartVerse}`
        : `${book.name} ${chapter}:${actualStartVerse}-${actualEndVerse}`;

    return {
      reference,
      translation,
      book,
      chapter,
      startVerse:
        actualStartVerse,
      endVerse:
        actualEndVerse,
      verses,
    };
  }

  /**
   * --------------------------------------------------
   * KJV single verse
   * --------------------------------------------------
   */
  private getKJVVerse(
    database: Database.Database,
    translationId: string,
    bookId: string,
    bookName: string,
    databaseBookId: number,
    chapter: number,
    verse: number,
  ): BibleVerse | null {
    const row =
      database
        .prepare(
          `
            SELECT
              chapter,
              number,
              text
            FROM verses
            WHERE book_id = ?
              AND chapter = ?
              AND number = ?
            LIMIT 1
          `,
        )
        .get(
          databaseBookId,
          chapter,
          verse,
        ) as
        | KJVVerseRow
        | undefined;

    if (!row) {
      return null;
    }

    return {
      translationId,
      bookId,
      bookName,
      chapter:
        row.chapter,
      verse:
        row.number,
      text:
        row.text,
    };
  }

  /**
   * --------------------------------------------------
   * Standard single verse
   * --------------------------------------------------
   */
  private getStandardVerse(
    database: Database.Database,
    translationId: string,
    bookId: string,
    bookName: string,
    databaseBookId: number,
    chapter: number,
    verse: number,
  ): BibleVerse | null {
    const row =
      database
        .prepare(
          `
            SELECT
              chapter,
              verse,
              text
            FROM verses
            WHERE book = ?
              AND chapter = ?
              AND verse = ?
            LIMIT 1
          `,
        )
        .get(
          databaseBookId,
          chapter,
          verse,
        ) as
        | StandardVerseRow
        | undefined;

    if (!row) {
      return null;
    }

    return {
      translationId,
      bookId,
      bookName,
      chapter:
        row.chapter,
      verse:
        row.verse,
      text:
        row.text,
    };
  }

  /**
   * --------------------------------------------------
   * KJV passage
   * --------------------------------------------------
   */
  private getKJVPassageVerses(
    database: Database.Database,
    translationId: string,
    bookId: string,
    bookName: string,
    databaseBookId: number,
    chapter: number,
    startVerse: number,
    endVerse: number,
  ): BibleVerse[] {
    const rows =
      database
        .prepare(
          `
            SELECT
              chapter,
              number,
              text
            FROM verses
            WHERE book_id = ?
              AND chapter = ?
              AND number BETWEEN ? AND ?
            ORDER BY number ASC
          `,
        )
        .all(
          databaseBookId,
          chapter,
          startVerse,
          endVerse,
        ) as KJVVerseRow[];

    return rows.map(
      (row) => ({
        translationId,
        bookId,
        bookName,
        chapter:
          row.chapter,
        verse:
          row.number,
        text:
          row.text,
      }),
    );
  }

  /**
   * --------------------------------------------------
   * Standard passage
   * --------------------------------------------------
   */
  private getStandardPassageVerses(
    database: Database.Database,
    translationId: string,
    bookId: string,
    bookName: string,
    databaseBookId: number,
    chapter: number,
    startVerse: number,
    endVerse: number,
  ): BibleVerse[] {
    const rows =
      database
        .prepare(
          `
            SELECT
              chapter,
              verse,
              text
            FROM verses
            WHERE book = ?
              AND chapter = ?
              AND verse BETWEEN ? AND ?
            ORDER BY verse ASC
          `,
        )
        .all(
          databaseBookId,
          chapter,
          startVerse,
          endVerse,
        ) as StandardVerseRow[];

    return rows.map(
      (row) => ({
        translationId,
        bookId,
        bookName,
        chapter:
          row.chapter,
        verse:
          row.verse,
        text:
          row.text,
      }),
    );
  }

  /**
   * --------------------------------------------------
   * Close databases
   * --------------------------------------------------
   */
  close(): void {
    for (
      const {
        database,
      } of this.databases.values()
    ) {
      if (
        database.open
      ) {
        database.close();
      }
    }

    this.databases.clear();
  }
}

export const localBibleRepository =
  new LocalBibleRepository();