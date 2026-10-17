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

/*
 * --------------------------------------------------
 * Bible book aliases
 * --------------------------------------------------
 *
 * These aliases are intentionally broader than the
 * canonical book names because speech recognition can
 * return abbreviated or slightly different forms.
 */

const BOOK_ALIASES: BookAlias[] = [
  {
    bookId: "genesis",
    aliases: ["genesis", "gen", "ge", "gn"],
  },
  {
    bookId: "exodus",
    aliases: ["exodus", "exod", "exo", "ex"],
  },
  {
    bookId: "leviticus",
    aliases: ["leviticus", "lev", "le", "lv"],
  },
  {
    bookId: "numbers",
    aliases: ["numbers", "number", "num", "nu", "nm"],
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
    aliases: ["judges", "judge", "judg", "jdg", "jg"],
  },
  {
    bookId: "ruth",
    aliases: ["ruth", "rth", "ru"],
  },
  {
    bookId: "1-samuel",
    aliases: [
      "1 samuel",
      "first samuel",
      "one samuel",
      "1 sam",
      "first sam",
      "one sam",
      "1sam",
    ],
  },
  {
    bookId: "2-samuel",
    aliases: [
      "2 samuel",
      "second samuel",
      "two samuel",
      "2 sam",
      "second sam",
      "two sam",
      "2sam",
    ],
  },
  {
    bookId: "1-kings",
    aliases: [
      "1 kings",
      "first kings",
      "one kings",
      "1 king",
      "first king",
      "one king",
      "1 kgs",
      "1kgs",
    ],
  },
  {
    bookId: "2-kings",
    aliases: [
      "2 kings",
      "second kings",
      "two kings",
      "2 king",
      "second king",
      "two king",
      "2 kgs",
      "2kgs",
    ],
  },
  {
    bookId: "1-chronicles",
    aliases: [
      "1 chronicles",
      "first chronicles",
      "one chronicles",
      "1 chron",
      "first chron",
      "one chron",
      "1 chr",
      "1chr",
    ],
  },
  {
    bookId: "2-chronicles",
    aliases: [
      "2 chronicles",
      "second chronicles",
      "two chronicles",
      "2 chron",
      "second chron",
      "two chron",
      "2 chr",
      "2chr",
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
    aliases: [
      "psalm",
      "psalms",
      "ps",
      "pss",
    ],
  },
  {
    bookId: "proverbs",
    aliases: [
      "proverbs",
      "proverb",
      "prov",
      "pro",
      "prv",
    ],
  },
  {
    bookId: "ecclesiastes",
    aliases: [
      "ecclesiastes",
      "ecclesiastes",
      "eccl",
      "ecc",
      "qoh",
    ],
  },
  {
    bookId: "song-of-solomon",
    aliases: [
      "song of solomon",
      "song of songs",
      "song",
      "songs",
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
    aliases: ["lamentations", "lamentation", "lam"],
  },
  {
    bookId: "ezekiel",
    aliases: ["ezekiel", "ezek", "eze"],
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

  /*
   * ------------------------------------------------
   * New Testament
   * ------------------------------------------------
   */

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
    aliases: ["romans", "roman", "rom", "ro"],
  },
  {
    bookId: "1-corinthians",
    aliases: [
      "1 corinthians",
      "first corinthians",
      "one corinthians",
      "1 corinthian",
      "first corinthian",
      "one corinthian",
      "1 cor",
      "first cor",
      "one cor",
      "1cor",
    ],
  },
  {
    bookId: "2-corinthians",
    aliases: [
      "2 corinthians",
      "second corinthians",
      "two corinthians",
      "2 corinthian",
      "second corinthian",
      "two corinthian",
      "2 cor",
      "second cor",
      "two cor",
      "2cor",
    ],
  },
  {
    bookId: "galatians",
    aliases: ["galatians", "galatian", "gal"],
  },
  {
    bookId: "ephesians",
    aliases: ["ephesians", "ephesian", "eph"],
  },
  {
    bookId: "philippians",
    aliases: [
      "philippians",
      "philippian",
      "phil",
      "php",
    ],
  },
  {
    bookId: "colossians",
    aliases: ["colossians", "colossian", "col"],
  },
  {
    bookId: "1-thessalonians",
    aliases: [
      "1 thessalonians",
      "first thessalonians",
      "one thessalonians",
      "1 thess",
      "first thess",
      "one thess",
      "1thess",
    ],
  },
  {
    bookId: "2-thessalonians",
    aliases: [
      "2 thessalonians",
      "second thessalonians",
      "two thessalonians",
      "2 thess",
      "second thess",
      "two thess",
      "2thess",
    ],
  },
  {
    bookId: "1-timothy",
    aliases: [
      "1 timothy",
      "first timothy",
      "one timothy",
      "1 tim",
      "first tim",
      "one tim",
      "1tim",
    ],
  },
  {
    bookId: "2-timothy",
    aliases: [
      "2 timothy",
      "second timothy",
      "two timothy",
      "2 tim",
      "second tim",
      "two tim",
      "2tim",
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
    aliases: ["hebrews", "hebrew", "heb"],
  },
  {
    bookId: "james",
    aliases: ["james", "jas", "jam"],
  },
  {
    bookId: "1-peter",
    aliases: [
      "1 peter",
      "first peter",
      "one peter",
      "1 pet",
      "first pet",
      "one pet",
      "1pet",
    ],
  },
  {
    bookId: "2-peter",
    aliases: [
      "2 peter",
      "second peter",
      "two peter",
      "2 pet",
      "second pet",
      "two pet",
      "2pet",
    ],
  },
  {
    bookId: "1-john",
    aliases: [
      "1 john",
      "first john",
      "one john",
      "1 jn",
      "first jn",
      "one jn",
      "1jn",
    ],
  },
  {
    bookId: "2-john",
    aliases: [
      "2 john",
      "second john",
      "two john",
      "2 jn",
      "second jn",
      "two jn",
      "2jn",
    ],
  },
  {
    bookId: "3-john",
    aliases: [
      "3 john",
      "third john",
      "three john",
      "3 jn",
      "third jn",
      "three jn",
      "3jn",
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
      "revelation of john",
      "rev",
      "apocalypse",
    ],
  },
];

/*
 * --------------------------------------------------
 * Spoken number dictionary
 * --------------------------------------------------
 */

const SMALL_NUMBER_WORDS: Record<
  string,
  number
> = {
  zero: 0,
  oh: 0,

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
};

const TENS_NUMBER_WORDS: Record<
  string,
  number
> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const ORDINAL_NUMBER_WORDS: Record<
  string,
  number
> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  thirtieth: 30,
  fortieth: 40,
  fiftieth: 50,
  sixtieth: 60,
  seventieth: 70,
  eightieth: 80,
  ninetieth: 90,
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * --------------------------------------------------
 * Number parsing
 * --------------------------------------------------
 *
 * Handles:
 *
 * 1
 * 16
 * one
 * sixteen
 * twenty three
 * twenty-three
 * one hundred and twenty
 */

function parseNumberWords(
  input: string,
): number | null {
  const normalized = normalize(input);

  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    const value = Number(normalized);

    return Number.isSafeInteger(value)
      ? value
      : null;
  }

  const ordinal =
    ORDINAL_NUMBER_WORDS[normalized];

  if (ordinal !== undefined) {
    return ordinal;
  }

  const small =
    SMALL_NUMBER_WORDS[normalized];

  if (small !== undefined) {
    return small;
  }

  const tens =
    TENS_NUMBER_WORDS[normalized];

  if (tens !== undefined) {
    return tens;
  }

  const tokens = normalized.split(" ");

  let total = 0;
  let current = 0;
  let foundNumber = false;

  for (const token of tokens) {
    if (token === "and") {
      continue;
    }

    const smallValue =
      SMALL_NUMBER_WORDS[token];

    if (smallValue !== undefined) {
      current += smallValue;
      foundNumber = true;
      continue;
    }

    const tensValue =
      TENS_NUMBER_WORDS[token];

    if (tensValue !== undefined) {
      current += tensValue;
      foundNumber = true;
      continue;
    }

    const ordinalValue =
      ORDINAL_NUMBER_WORDS[token];

    if (ordinalValue !== undefined) {
      current += ordinalValue;
      foundNumber = true;
      continue;
    }

    if (token === "hundred") {
      if (current === 0) {
        current = 1;
      }

      current *= 100;
      foundNumber = true;
      continue;
    }

    if (token === "thousand") {
      if (current === 0) {
        current = 1;
      }

      total += current * 1000;
      current = 0;
      foundNumber = true;
      continue;
    }

    return null;
  }

  if (!foundNumber) {
    return null;
  }

  return total + current;
}

/*
 * --------------------------------------------------
 * Number token helpers
 * --------------------------------------------------
 */

function isNumberToken(
  token: string,
): boolean {
  return (
    /^\d+$/.test(token) ||
    SMALL_NUMBER_WORDS[token] !==
      undefined ||
    TENS_NUMBER_WORDS[token] !==
      undefined ||
    ORDINAL_NUMBER_WORDS[token] !==
      undefined
  );
}

function readSpokenNumber(
  tokens: string[],
  startIndex: number,
): {
  value: number;
  nextIndex: number;
} | null {
  if (
    startIndex >= tokens.length
  ) {
    return null;
  }

  const firstToken =
    tokens[startIndex];

  if (
    /^\d+$/.test(firstToken)
  ) {
    return {
      value: Number(firstToken),
      nextIndex: startIndex + 1,
    };
  }

  if (
    !isNumberToken(firstToken)
  ) {
    return null;
  }

  const parts: string[] = [];

  let index = startIndex;

  /*
   * Capture a short spoken-number sequence.
   *
   * Examples:
   *
   * twenty three
   * one hundred and twenty
   * sixteen
   */
  while (
    index < tokens.length &&
    parts.length < 5
  ) {
    const token =
      tokens[index];

    if (
      isNumberToken(token) ||
      token === "and" ||
      token === "hundred" ||
      token === "thousand"
    ) {
      parts.push(token);
      index += 1;
      continue;
    }

    break;
  }

  /*
   * Avoid consuming "and" by itself.
   */
  if (
    parts.length === 1 &&
    parts[0] === "and"
  ) {
    return null;
  }

  const value =
    parseNumberWords(
      parts.join(" "),
    );

  if (value === null) {
    return null;
  }

  return {
    value,
    nextIndex: index,
  };
}

/*
 * --------------------------------------------------
 * Book resolution
 * --------------------------------------------------
 */

function resolveBook(
  input: string,
): BookAlias | undefined {
  const normalized =
    normalize(input);

  /*
   * Exact alias match first.
   */
  const exact =
    BOOK_ALIASES.find((book) =>
      book.aliases.some(
        (alias) =>
          normalize(alias) ===
          normalized,
      ),
    );

  if (exact) {
    return exact;
  }

  /*
   * Some speech recognition engines can
   * accidentally leave a little punctuation
   * or duplicate whitespace around a book name.
   */
  return BOOK_ALIASES.find((book) =>
    book.aliases.some((alias) => {
      const normalizedAlias =
        normalize(alias);

      return (
        normalized.includes(
          normalizedAlias,
        ) ||
        normalizedAlias.includes(
          normalized,
        )
      );
    }),
  );
}

/*
 * --------------------------------------------------
 * Find matching Bible book from BIBLE_BOOKS
 * --------------------------------------------------
 */

function getBibleBook(
  bookId: string,
) {
  return BIBLE_BOOKS.find(
    (book) => book.id === bookId,
  );
}

/*
 * --------------------------------------------------
 * Standard reference parser
 * --------------------------------------------------
 *
 * Supports:
 *
 * John 3
 * John 3:16
 * John 3:16-18
 * 1 Corinthians 13:4
 * Psalm 23:1
 */

function parseStandardReference(
  input: string,
): ParsedBibleReference | null {
  const normalized =
    normalize(input);

  const match =
    normalized.match(
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

  const bibleBook =
    getBibleBook(
      resolvedBook.bookId,
    );

  if (!bibleBook) {
    return null;
  }

  const chapter =
    Number(rawChapter);

  const startVerse =
    rawStartVerse
      ? Number(rawStartVerse)
      : undefined;

  const endVerse =
    rawEndVerse
      ? Number(rawEndVerse)
      : undefined;

  if (
    !Number.isInteger(chapter) ||
    chapter < 1
  ) {
    return null;
  }

  if (
    startVerse !== undefined &&
    (!Number.isInteger(startVerse) ||
      startVerse < 1)
  ) {
    return null;
  }

  if (
    endVerse !== undefined &&
    (!Number.isInteger(endVerse) ||
      endVerse < startVerse!)
  ) {
    return null;
  }

  return {
    bookId: bibleBook.id,
    bookName: bibleBook.name,
    chapter,
    startVerse,
    endVerse,
  };
}

/*
 * --------------------------------------------------
 * Spoken reference parser
 * --------------------------------------------------
 *
 * Supports:
 *
 * John chapter 1 verse 1
 * John chapter one verse one
 * John chapter 3 verse 16
 * John chapter three verse sixteen
 * Psalm 23 verse 1
 * Psalm twenty three verse one
 * First Corinthians chapter 13 verse 4
 * First Corinthians chapter thirteen verse four
 *
 * It also supports chapter-only references:
 *
 * John chapter 3
 * John 3
 */

function parseSpokenReference(
  input: string,
): ParsedBibleReference | null {
  const normalized =
    normalize(input);

  if (!normalized) {
    return null;
  }

  const tokens =
    normalized.split(" ");

  /*
   * Locate the book by testing progressively longer
   * prefixes.
   *
   * This is important for:
   *
   * "first corinthians chapter thirteen verse four"
   *
   * where the book name occupies multiple tokens.
   */
  let resolvedBook:
    | BookAlias
    | undefined;

  let bookEndIndex = -1;

  const maximumBookTokens =
    Math.min(tokens.length, 5);

  for (
    let length = maximumBookTokens;
    length >= 1;
    length -= 1
  ) {
    const candidate =
      tokens
        .slice(0, length)
        .join(" ");

    const match =
      resolveBook(candidate);

    if (match) {
      resolvedBook = match;
      bookEndIndex = length;
      break;
    }
  }

  if (
    !resolvedBook ||
    bookEndIndex === -1
  ) {
    return null;
  }

  const bibleBook =
    getBibleBook(
      resolvedBook.bookId,
    );

  if (!bibleBook) {
    return null;
  }

  let index = bookEndIndex;

  /*
   * ------------------------------------------------
   * Chapter
   * ------------------------------------------------
   */

  if (
    tokens[index] === "chapter" ||
    tokens[index] === "chap" ||
    tokens[index] === "ch"
  ) {
    index += 1;
  }

  const chapterResult =
    readSpokenNumber(
      tokens,
      index,
    );

  if (!chapterResult) {
    return null;
  }

  const chapter =
    chapterResult.value;

  index =
    chapterResult.nextIndex;

  if (
    !Number.isInteger(chapter) ||
    chapter < 1
  ) {
    return null;
  }

  /*
   * ------------------------------------------------
   * Verse
   * ------------------------------------------------
   *
   * The word "verse" is optional because speech
   * recognition may produce:
   *
   * John 3 16
   * John 3 verse 16
   */

  if (
    tokens[index] === "verse" ||
    tokens[index] === "verses" ||
    tokens[index] === "v"
  ) {
    index += 1;
  }

  /*
   * No remaining tokens means this is a
   * chapter-only reference.
   */
  if (index >= tokens.length) {
    return {
      bookId: bibleBook.id,
      bookName: bibleBook.name,
      chapter,
    };
  }

  /*
   * ------------------------------------------------
   * Verse range
   * ------------------------------------------------
   */

  const startVerseResult =
    readSpokenNumber(
      tokens,
      index,
    );

  if (!startVerseResult) {
    return null;
  }

  const startVerse =
    startVerseResult.value;

  index =
    startVerseResult.nextIndex;

  if (
    !Number.isInteger(startVerse) ||
    startVerse < 1
  ) {
    return null;
  }

  /*
   * Handle:
   *
   * John 3:16-18
   * John 3 verse 16 to 18
   * John 3 verse 16 through 18
   * John 3 verses 16 to 18
   */
  if (
    index < tokens.length &&
    (
      tokens[index] === "to" ||
      tokens[index] === "through" ||
      tokens[index] === "thru" ||
      tokens[index] === "-"
    )
  ) {
    index += 1;

    const endVerseResult =
      readSpokenNumber(
        tokens,
        index,
      );

    if (!endVerseResult) {
      return null;
    }

    const endVerse =
      endVerseResult.value;

    if (
      !Number.isInteger(endVerse) ||
      endVerse < startVerse
    ) {
      return null;
    }

    index =
      endVerseResult.nextIndex;

    /*
     * Ignore harmless trailing speech
     * punctuation/words only if nothing meaningful
     * remains.
     */
    if (index < tokens.length) {
      const remaining =
        tokens
          .slice(index)
          .filter(
            (token) =>
              token !== "please" &&
              token !== "read" &&
              token !== "from" &&
              token !== "the",
          );

      if (remaining.length > 0) {
        return null;
      }
    }

    return {
      bookId: bibleBook.id,
      bookName: bibleBook.name,
      chapter,
      startVerse,
      endVerse,
    };
  }

  /*
   * A trailing colon-style range may sometimes
   * be converted by speech recognition into:
   *
   * "16 18"
   */
  if (index < tokens.length) {
    const possibleEnd =
      readSpokenNumber(
        tokens,
        index,
      );

    if (possibleEnd) {
      const remaining =
        possibleEnd.nextIndex <
        tokens.length
          ? tokens
              .slice(
                possibleEnd.nextIndex,
              )
              .filter(
                (token) =>
                  token !== "please" &&
                  token !== "read",
              )
          : [];

      if (
        remaining.length === 0 &&
        possibleEnd.value >=
          startVerse
      ) {
        return {
          bookId: bibleBook.id,
          bookName: bibleBook.name,
          chapter,
          startVerse,
          endVerse:
            possibleEnd.value,
        };
      }
    }
  }

  /*
   * If anything other than harmless trailing
   * words remains, do not classify the speech
   * as a Bible reference.
   */
  if (index < tokens.length) {
    const remaining =
      tokens
        .slice(index)
        .filter(
          (token) =>
            token !== "please" &&
            token !== "read",
        );

    if (remaining.length > 0) {
      return null;
    }
  }

  return {
    bookId: bibleBook.id,
    bookName: bibleBook.name,
    chapter,
    startVerse,
  };
}

/*
 * --------------------------------------------------
 * Public parser
 * --------------------------------------------------
 *
 * This is the main function that the rest of the
 * Bible Assistant should use.
 */

export function parseBibleReference(
  input: string,
): ParsedBibleReference | null {
  const normalized =
    normalize(input);

  if (!normalized) {
    return null;
  }

  /*
   * First try exact conventional notation.
   *
   * This handles:
   *
   * John 3:16
   * John 3:16-18
   * Psalm 23:1
   */
  const standard =
    parseStandardReference(
      normalized,
    );

  if (standard) {
    return standard;
  }

  /*
   * Then try natural spoken-language notation.
   *
   * This handles:
   *
   * John chapter one verse one
   * John chapter 3 verse 16
   * First Corinthians chapter thirteen verse four
   */
  return parseSpokenReference(
    normalized,
  );
}

/*
 * --------------------------------------------------
 * Convenience helper
 * --------------------------------------------------
 *
 * Useful for the speech pipeline.
 *
 * It returns true when the supplied speech looks
 * sufficiently like a Bible reference to be passed
 * to BibleService.
 */

export function isBibleReference(
  input: string,
): boolean {
  return (
    parseBibleReference(input) !==
    null
  );
}

/*
 * --------------------------------------------------
 * Reference formatter
 * --------------------------------------------------
 *
 * Converts a parsed reference into the canonical
 * format expected by the Bible service.
 *
 * Examples:
 *
 * John 3:16
 * Psalm 23:1
 * 1 Corinthians 13:4-7
 */

export function formatBibleReference(
  reference: ParsedBibleReference,
): string {
  const {
    bookName,
    chapter,
    startVerse,
    endVerse,
  } = reference;

  if (startVerse === undefined) {
    return `${bookName} ${chapter}`;
  }

  if (
    endVerse !== undefined &&
    endVerse !== startVerse
  ) {
    return `${bookName} ${chapter}:${startVerse}-${endVerse}`;
  }

  return `${bookName} ${chapter}:${startVerse}`;
}
