import { BIBLE_BOOKS } from "./bible.data";

export interface ParsedBibleReference {
  bookId: string;
  bookName: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
}

interface BookAlias {
  bookId: string;
  aliases: string[];
}

const BOOK_ALIASES: BookAlias[] = [
  {
    bookId: "genesis",
    aliases: ["genesis", "gen"],
  },
  {
    bookId: "exodus",
    aliases: ["exodus", "exod", "exo", "ex"],
  },
  {
    bookId: "leviticus",
    aliases: ["leviticus", "lev"],
  },
  {
    bookId: "numbers",
    aliases: ["numbers", "num", "nu", "nm"],
  },
  {
    bookId: "deuteronomy",
    aliases: ["deuteronomy", "deut", "deu", "dt"],
  },
  {
    bookId: "joshua",
    aliases: ["joshua", "josh", "jos"],
  },
  {
    bookId: "judges",
    aliases: ["judges", "judg", "jdg", "jg"],
  },
  {
    bookId: "ruth",
    aliases: ["ruth", "rth", "ru"],
  },
  {
    bookId: "1-samuel",
    aliases: [
      "1 samuel",
      "1 sam",
      "1sam",
      "first samuel",
      "first sam",
    ],
  },
  {
    bookId: "2-samuel",
    aliases: [
      "2 samuel",
      "2 sam",
      "2sam",
      "second samuel",
      "second sam",
    ],
  },
  {
    bookId: "1-kings",
    aliases: [
      "1 kings",
      "1 kgs",
      "1kgs",
      "first kings",
      "first kgs",
    ],
  },
  {
    bookId: "2-kings",
    aliases: [
      "2 kings",
      "2 kgs",
      "2kgs",
      "second kings",
      "second kgs",
    ],
  },
  {
    bookId: "1-chronicles",
    aliases: [
      "1 chronicles",
      "1 chr",
      "1chr",
      "first chronicles",
      "first chron",
    ],
  },
  {
    bookId: "2-chronicles",
    aliases: [
      "2 chronicles",
      "2 chr",
      "2chr",
      "second chronicles",
      "second chron",
    ],
  },
  {
    bookId: "ezra",
    aliases: ["ezra", "ezr"],
  },
  {
    bookId: "nehemiah",
    aliases: ["nehemiah", "neh"],
  },
  {
    bookId: "esther",
    aliases: ["esther", "esth", "est"],
  },
  {
    bookId: "job",
    aliases: ["job"],
  },
  {
    bookId: "psalms",
    aliases: ["psalm", "psalms", "ps"],
  },
  {
    bookId: "proverbs",
    aliases: ["proverbs", "prov", "pro", "prv"],
  },
  {
    bookId: "ecclesiastes",
    aliases: ["ecclesiastes", "eccl", "ecc", "qoh"],
  },
  {
    bookId: "song-of-solomon",
    aliases: [
      "song of solomon",
      "song of songs",
      "song",
      "sos",
    ],
  },
  {
    bookId: "isaiah",
    aliases: ["isaiah", "isa"],
  },
  {
    bookId: "jeremiah",
    aliases: ["jeremiah", "jer"],
  },
  {
    bookId: "lamentations",
    aliases: ["lamentations", "lam"],
  },
  {
    bookId: "ezekiel",
    aliases: ["ezekiel", "ezek"],
  },
  {
    bookId: "daniel",
    aliases: ["daniel", "dan"],
  },
  {
    bookId: "hosea",
    aliases: ["hosea", "hos"],
  },
  {
    bookId: "joel",
    aliases: ["joel"],
  },
  {
    bookId: "amos",
    aliases: ["amos"],
  },
  {
    bookId: "obadiah",
    aliases: ["obadiah", "obad"],
  },
  {
    bookId: "jonah",
    aliases: ["jonah", "jon"],
  },
  {
    bookId: "micah",
    aliases: ["micah", "mic"],
  },
  {
    bookId: "nahum",
    aliases: ["nahum", "nah"],
  },
  {
    bookId: "habakkuk",
    aliases: ["habakkuk", "hab"],
  },
  {
    bookId: "zephaniah",
    aliases: ["zephaniah", "zeph"],
  },
  {
    bookId: "haggai",
    aliases: ["haggai", "hag"],
  },
  {
    bookId: "zechariah",
    aliases: ["zechariah", "zech", "zec"],
  },
  {
    bookId: "malachi",
    aliases: ["malachi", "mal"],
  },

  {
    bookId: "matthew",
    aliases: ["matthew", "matt", "mt"],
  },
  {
    bookId: "mark",
    aliases: ["mark", "mk", "mrk"],
  },
  {
    bookId: "luke",
    aliases: ["luke", "lk", "luk"],
  },
  {
    bookId: "john",
    aliases: ["john", "jn", "joh"],
  },
  {
    bookId: "acts",
    aliases: ["acts", "act"],
  },
  {
    bookId: "romans",
    aliases: ["romans", "rom", "ro"],
  },
  {
    bookId: "1-corinthians",
    aliases: [
      "1 corinthians",
      "1 cor",
      "1cor",
      "first corinthians",
      "first cor",
    ],
  },
  {
    bookId: "2-corinthians",
    aliases: [
      "2 corinthians",
      "2 cor",
      "2cor",
      "second corinthians",
      "second cor",
    ],
  },
  {
    bookId: "galatians",
    aliases: ["galatians", "gal"],
  },
  {
    bookId: "ephesians",
    aliases: ["ephesians", "eph"],
  },
  {
    bookId: "philippians",
    aliases: ["philippians", "phil", "php"],
  },
  {
    bookId: "colossians",
    aliases: ["colossians", "col"],
  },
  {
    bookId: "1-thessalonians",
    aliases: [
      "1 thessalonians",
      "1 thess",
      "1thess",
      "first thessalonians",
      "first thess",
    ],
  },
  {
    bookId: "2-thessalonians",
    aliases: [
      "2 thessalonians",
      "2 thess",
      "2thess",
      "second thessalonians",
      "second thess",
    ],
  },
  {
    bookId: "1-timothy",
    aliases: [
      "1 timothy",
      "1 tim",
      "1tim",
      "first timothy",
      "first tim",
    ],
  },
  {
    bookId: "2-timothy",
    aliases: [
      "2 timothy",
      "2 tim",
      "2tim",
      "second timothy",
      "second tim",
    ],
  },
  {
    bookId: "titus",
    aliases: ["titus", "tit"],
  },
  {
    bookId: "philemon",
    aliases: ["philemon", "philem", "phlm"],
  },
  {
    bookId: "hebrews",
    aliases: ["hebrews", "heb"],
  },
  {
    bookId: "james",
    aliases: ["james", "jas", "jam"],
  },
  {
    bookId: "1-peter",
    aliases: [
      "1 peter",
      "1 pet",
      "1pet",
      "first peter",
      "first pet",
    ],
  },
  {
    bookId: "2-peter",
    aliases: [
      "2 peter",
      "2 pet",
      "2pet",
      "second peter",
      "second pet",
    ],
  },
  {
    bookId: "1-john",
    aliases: [
      "1 john",
      "1 jn",
      "1jn",
      "first john",
      "first jn",
    ],
  },
  {
    bookId: "2-john",
    aliases: [
      "2 john",
      "2 jn",
      "2jn",
      "second john",
      "second jn",
    ],
  },
  {
    bookId: "3-john",
    aliases: [
      "3 john",
      "3 jn",
      "3jn",
      "third john",
      "third jn",
    ],
  },
  {
    bookId: "jude",
    aliases: ["jude"],
  },
  {
    bookId: "revelation",
    aliases: [
      "revelation",
      "revelations",
      "rev",
      "apocalypse",
    ],
  },
];

/**
 * Normalize text before parsing.
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;()[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Spoken number vocabulary.
 */
const NUMBER_WORDS: Record<string, number> = {
  zero: 0,

  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,

  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,

  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,

  hundred: 100,
};

/**
 * Parse a spoken number.
 *
 * Examples:
 *
 * one -> 1
 * thirteen -> 13
 * twenty one -> 21
 * thirty six -> 36
 * one hundred -> 100
 * one hundred twenty three -> 123
 */
function parseNumberWords(
  input: string,
): number | null {
  const normalized = normalize(input);

  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const tokens = normalized.split(" ");

  let total = 0;
  let current = 0;

  for (const token of tokens) {
    const value = NUMBER_WORDS[token];

    if (value === undefined) {
      return null;
    }

    if (value === 100) {
      if (current === 0) {
        current = 1;
      }

      current *= 100;
      total += current;
      current = 0;
      continue;
    }

    current += value;
  }

  total += current;

  return total > 0 ? total : null;
}

/**
 * Resolve an exact Bible book alias.
 */
function resolveBook(
  input: string,
): BookAlias | undefined {
  const normalized = normalize(input);

  return BOOK_ALIASES.find((book) =>
    book.aliases.some(
      (alias) =>
        normalize(alias) === normalized,
    ),
  );
}

/**
 * Get the canonical Bible book from a book alias.
 */
function getBibleBook(
  bookId: string,
) {
  return BIBLE_BOOKS.find(
    (book) => book.id === bookId,
  );
}

/**
 * Find a Bible book inside a longer sentence.
 *
 * Example:
 *
 * "please read John chapter three verse sixteen"
 */
function findBookInText(
  input: string,
): {
  book: BookAlias;
  start: number;
  end: number;
} | null {
  const normalized = normalize(input);

  const aliases = BOOK_ALIASES
    .flatMap((book) =>
      book.aliases.map((alias) => ({
        book,
        alias: normalize(alias),
      })),
    )
    .sort(
      (a, b) =>
        b.alias.length - a.alias.length,
    );

  for (const entry of aliases) {
    const pattern =
      new RegExp(
        `(^|\\s)${escapeRegExp(
          entry.alias,
        )}(?=\\s|$)`,
      );

    const match =
      pattern.exec(normalized);

    if (!match) {
      continue;
    }

    const start =
      match.index + match[1].length;

    return {
      book: entry.book,
      start,
      end:
        start + entry.alias.length,
    };
  }

  return null;
}

/**
 * Escape text before inserting it into a RegExp.
 */
function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

/**
 * Normalize spoken number phrases.
 *
 * Examples:
 *
 * chapter one verse one
 * -> chapter 1 verse 1
 *
 * chapter thirteen verse sixteen
 * -> chapter 13 verse 16
 *
 * chapter twenty one verse thirty six
 * -> chapter 21 verse 36
 */
function normalizeSpokenNumbers(
  input: string,
): string {
  const normalized = normalize(input);

  if (!normalized) {
    return "";
  }

  const tokens = normalized.split(" ");
  const result: string[] = [];

  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];

    /*
     * Do not attempt to convert a number that is
     * already numeric.
     */
    if (/^\d+$/.test(token)) {
      result.push(token);
      index += 1;
      continue;
    }

    /*
     * Try up to four words so that phrases such as:
     *
     * one hundred twenty three
     *
     * are handled as a single number.
     */
    let matchedNumber: number | null = null;
    let matchedLength = 0;

    for (
      let length = Math.min(
        4,
        tokens.length - index,
      );
      length >= 1;
      length -= 1
    ) {
      const phrase = tokens
        .slice(index, index + length)
        .join(" ");

      const value =
        parseNumberWords(phrase);

      if (value !== null) {
        matchedNumber = value;
        matchedLength = length;
        break;
      }
    }

    if (
      matchedNumber !== null &&
      matchedLength > 0
    ) {
      result.push(String(matchedNumber));
      index += matchedLength;
      continue;
    }

    result.push(token);
    index += 1;
  }

  return result.join(" ");
}

/**
 * Build a ParsedBibleReference from a resolved book.
 */
function createReference(
  bookId: string,
  chapter: string | number,
  startVerse?: string | number,
  endVerse?: string | number,
): ParsedBibleReference | null {
  const bibleBook = getBibleBook(bookId);

  if (!bibleBook) {
    return null;
  }

  const chapterNumber =
    typeof chapter === "number"
      ? chapter
      : Number(chapter);

  if (
    !Number.isInteger(chapterNumber) ||
    chapterNumber <= 0
  ) {
    return null;
  }

  const startVerseNumber =
    startVerse === undefined
      ? undefined
      : typeof startVerse === "number"
        ? startVerse
        : Number(startVerse);

  const endVerseNumber =
    endVerse === undefined
      ? undefined
      : typeof endVerse === "number"
        ? endVerse
        : Number(endVerse);

  if (
    startVerseNumber !== undefined &&
    (!Number.isInteger(startVerseNumber) ||
      startVerseNumber <= 0)
  ) {
    return null;
  }

  if (
    endVerseNumber !== undefined &&
    (!Number.isInteger(endVerseNumber) ||
      endVerseNumber <= 0)
  ) {
    return null;
  }

  if (
    startVerseNumber !== undefined &&
    endVerseNumber !== undefined &&
    endVerseNumber < startVerseNumber
  ) {
    return null;
  }

  return {
    bookId: bibleBook.id,
    bookName: bibleBook.name,
    chapter: chapterNumber,
    startVerse: startVerseNumber,
    endVerse: endVerseNumber,
  };
}

/**
 * Parse standard written Bible notation.
 *
 * Supported:
 *
 * John 3
 * John 3:16
 * John 3:16-18
 * 1 Corinthians 13:4
 * Psalm 23
 */
function parseStandardReference(
  input: string,
): ParsedBibleReference | null {
  const normalized = normalize(input);

  const match = normalized.match(
    /^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/,
  );

  if (!match) {
    return null;
  }

  const [
    ,
    rawBook,
    rawChapter,
    rawStartVerse,
    rawEndVerse,
  ] = match;

  const resolvedBook =
    resolveBook(rawBook);

  if (!resolvedBook) {
    return null;
  }

  return createReference(
    resolvedBook.bookId,
    rawChapter,
    rawStartVerse,
    rawEndVerse,
  );
}

/**
 * Parse natural spoken Bible references.
 *
 * Supported:
 *
 * John chapter 1 verse 1
 * John chapter one verse one
 * John 1 verse 1
 * John one verse one
 * John chapter 3 verses 16 to 18
 * John 3:16
 */
function parseSpokenReference(
  input: string,
): ParsedBibleReference | null {
  const normalized =
    normalizeSpokenNumbers(input);

  /*
   * Explicit:
   *
   * John chapter 3 verse 16
   * John chapter 3 verses 16 to 18
   * John chapter 3
   */
  const explicitMatch =
    normalized.match(
      /^(.+?)\s+chapter\s+(\d+)(?:\s+verses?\s+(\d+)(?:\s+(?:to|through|-)\s+(\d+))?)?$/,
    );

  if (explicitMatch) {
    const [
      ,
      rawBook,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = explicitMatch;

    const resolvedBook =
      resolveBook(rawBook);

    if (!resolvedBook) {
      return null;
    }

    return createReference(
      resolvedBook.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  /*
   * Numeric chapter + spoken verse:
   *
   * John 3 verse 16
   * John 3 verses 16 to 18
   */
  const numericVerseMatch =
    normalized.match(
      /^(.+?)\s+(\d+)\s+verses?\s+(\d+)(?:\s+(?:to|through|-)\s+(\d+))?$/,
    );

  if (numericVerseMatch) {
    const [
      ,
      rawBook,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = numericVerseMatch;

    const resolvedBook =
      resolveBook(rawBook);

    if (!resolvedBook) {
      return null;
    }

    return createReference(
      resolvedBook.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  /*
   * Spoken chapter + numeric verse:
   *
   * John three 16
   *
   * After number normalization:
   *
   * John 3 16
   */
  const chapterAndVerseMatch =
    normalized.match(
      /^(.+?)\s+(\d+)\s+(\d+)(?:\s+(?:to|through|-)\s+(\d+))?$/,
    );

  if (chapterAndVerseMatch) {
    const [
      ,
      rawBook,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = chapterAndVerseMatch;

    const resolvedBook =
      resolveBook(rawBook);

    if (!resolvedBook) {
      return null;
    }

    return createReference(
      resolvedBook.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  return null;
}

/**
 * Parse a Bible reference from a longer sentence.
 *
 * Example:
 *
 * "please turn to John chapter three verse sixteen"
 *
 * "the scripture is John 3:16"
 *
 * "read first Corinthians chapter thirteen verse four"
 */
function parseReferenceFromSentence(
  input: string,
): ParsedBibleReference | null {
  const normalized =
    normalizeSpokenNumbers(input);

  const bookMatch =
    findBookInText(normalized);

  if (!bookMatch) {
    return null;
  }

  const afterBook =
    normalized
      .slice(bookMatch.end)
      .trim();

  /*
   * chapter 3 verse 16
   *
   * chapter 3 verses 16 to 18
   */
  const chapterVerseMatch =
    afterBook.match(
      /^chapter\s+(\d+)(?:\s+verses?\s+(\d+)(?:\s+(?:to|through|-)\s+(\d+))?)?/,
    );

  if (chapterVerseMatch) {
    const [
      ,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = chapterVerseMatch;

    return createReference(
      bookMatch.book.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  /*
   * 3 verse 16
   *
   * 3 verses 16 to 18
   */
  const numericVerseMatch =
    afterBook.match(
      /^(\d+)\s+verses?\s+(\d+)(?:\s+(?:to|through|-)\s+(\d+))?/,
    );

  if (numericVerseMatch) {
    const [
      ,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = numericVerseMatch;

    return createReference(
      bookMatch.book.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  /*
   * Standard:
   *
   * John 3:16
   * John 3:16-18
   * John 3
   */
  const standardAfterBook =
    afterBook.match(
      /^(\d+)(?::(\d+)(?:-(\d+))?)?/,
    );

  if (standardAfterBook) {
    const [
      ,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    ] = standardAfterBook;

    return createReference(
      bookMatch.book.bookId,
      rawChapter,
      rawStartVerse,
      rawEndVerse,
    );
  }

  /*
   * If the speaker says:
   *
   * "John chapter three"
   *
   * the chapter parser above handles it.
   *
   * If the speaker only says:
   *
   * "John"
   *
   * there is not enough information to resolve
   * a chapter, so return null.
   */
  return null;
}

/**
 * Parse a Bible reference from:
 *
 * 1. Standard written notation
 * 2. Natural spoken notation
 * 3. A longer sentence containing a reference
 *
 * Examples:
 *
 * John 3:16
 * John 3:16-18
 * John chapter 3 verse 16
 * John chapter three verse sixteen
 * please read John chapter three verse sixteen
 * turn to first Corinthians thirteen four
 */
export function parseBibleReference(
  input: string,
): ParsedBibleReference | null {
  if (!input?.trim()) {
    return null;
  }

  /*
   * --------------------------------------------------
   * 1. Strict standard reference
   * --------------------------------------------------
   */
  const standard =
    parseStandardReference(input);

  if (standard) {
    return standard;
  }

  /*
   * --------------------------------------------------
   * 2. Spoken reference
   * --------------------------------------------------
   */
  const spoken =
    parseSpokenReference(input);

  if (spoken) {
    return spoken;
  }

  /*
   * --------------------------------------------------
   * 3. Reference embedded in a sentence
   * --------------------------------------------------
   */
  return parseReferenceFromSentence(
    input,
  );
}

/**
 * Convert a parsed reference into the canonical
 * string expected by the Bible service.
 *
 * Examples:
 *
 * {
 *   bookName: "John",
 *   chapter: 3,
 *   startVerse: 16
 * }
 *
 * -> "John 3:16"
 *
 * {
 *   bookName: "John",
 *   chapter: 3,
 *   startVerse: 16,
 *   endVerse: 18
 * }
 *
 * -> "John 3:16-18"
 */
export function formatBibleReference(
  reference: ParsedBibleReference,
): string {
  let result =
    `${reference.bookName} ${reference.chapter}`;

  if (
    reference.startVerse !== undefined
  ) {
    result += `:${reference.startVerse}`;

    if (
      reference.endVerse !== undefined &&
      reference.endVerse !==
        reference.startVerse
    ) {
      result += `-${reference.endVerse}`;
    }
  }

  return result;
}