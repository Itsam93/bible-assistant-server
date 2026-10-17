import {
  BIBLE_BOOKS,
} from "./bible.data";

import type {
  ParsedBibleReference,
} from "./bible.reference-parser";

/**
 * Spoken number vocabulary used by the
 * natural-language Bible reference parser.
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
 * Normalize speech/text before parsing.
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Convert a spoken number into a numeric value.
 *
 * Examples:
 *
 * "three" -> 3
 * "sixteen" -> 16
 * "twenty eight" -> 28
 * "one hundred" -> 100
 * "one hundred twenty three" -> 123
 * "twenty-eight" -> 28
 */
function numberFromWords(
  value: string,
): number | null {
  const normalized = normalize(
    value.replace(/-/g, " "),
  );

  if (!normalized) {
    return null;
  }

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const parts = normalized.split(/\s+/);

  let total = 0;
  let current = 0;

  for (const part of parts) {
    const number =
      NUMBER_WORDS[part];

    if (number === undefined) {
      return null;
    }

    if (number === 100) {
      if (current === 0) {
        current = 1;
      }

      current *= 100;
      total += current;
      current = 0;

      continue;
    }

    current += number;
  }

  total += current;

  return total > 0 ? total : null;
}

/**
 * Normalize a Bible book name or abbreviation.
 */
function normalizeBookName(
  value: string,
): string {
  return normalize(value);
}

/**
 * Find a Bible book by its canonical name
 * or abbreviation.
 */
function findBook(
  value: string,
) {
  const normalized =
    normalizeBookName(value);

  return BIBLE_BOOKS.find(
    (book) => {
      const nameMatches =
        normalizeBookName(book.name) ===
        normalized;

      const abbreviationMatches =
        book.abbreviation !== undefined &&
        normalizeBookName(
          book.abbreviation,
        ) === normalized;

      return (
        nameMatches ||
        abbreviationMatches
      );
    },
  );
}

/**
 * Convert spoken ordinal/cardinal noise that
 * frequently appears in speech recognition
 * into a form the parser can understand.
 *
 * Examples:
 *
 * "chapter three" -> "chapter three"
 * "chapter the three" -> "chapter three"
 * "verse number sixteen" -> "verse sixteen"
 * "verses sixteen through eighteen"
 *   -> "verses sixteen through eighteen"
 */
function normalizeReferenceLanguage(
  input: string,
): string {
  return normalize(input)
    .replace(
      /\bchapter\s+the\s+/g,
      "chapter ",
    )
    .replace(
      /\bchapters?\s+the\s+/g,
      "chapter ",
    )
    .replace(
      /\bverse\s+number\s+/g,
      "verse ",
    )
    .replace(
      /\bverses\s+number\s+/g,
      "verses ",
    )
    .replace(
      /\bverse\s+no\.?\s+/g,
      "verse ",
    )
    .replace(
      /\bverses\s+no\.?\s+/g,
      "verses ",
    );
}

/**
 * Parse a natural spoken Bible reference.
 *
 * Supported examples:
 *
 * John chapter three verse sixteen
 * John chapter 3 verse 16
 * John chapter three verses sixteen to eighteen
 * John chapter three verses sixteen through eighteen
 * Romans chapter eight verse twenty eight
 * 1 Corinthians chapter thirteen verse four
 *
 * The parser intentionally accepts only references
 * containing an explicit "chapter" and "verse(s)"
 * structure. Standard references such as
 * "John 3:16" are handled by the main reference parser.
 */
export function parseNaturalBibleReference(
  input: string,
): ParsedBibleReference | null {
  if (!input?.trim()) {
    return null;
  }

  const normalized =
    normalizeReferenceLanguage(input);

  /*
   * --------------------------------------------------
   * Explicit chapter + verse syntax
   * --------------------------------------------------
   *
   * Examples:
   *
   * John chapter three verse sixteen
   * John chapter 3 verse 16
   * John chapter three verses sixteen to eighteen
   * John chapter three verses sixteen through eighteen
   */
  const match = normalized.match(
    /^(.+?)\s+chapters?\s+(.+?)\s+verses?\s+(.+?)(?:\s+(?:to|through|-)\s+(.+))?$/,
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

  /*
   * Resolve the book.
   */
  const book = findBook(rawBook);

  if (!book) {
    return null;
  }

  /*
   * Resolve the chapter number.
   */
  const chapter =
    numberFromWords(rawChapter);

  if (chapter === null) {
    return null;
  }

  /*
   * Resolve the starting verse.
   */
  const startVerse =
    numberFromWords(rawStartVerse);

  if (startVerse === null) {
    return null;
  }

  /*
   * Resolve the optional ending verse.
   */
  const parsedEndVerse =
    rawEndVerse
      ? numberFromWords(rawEndVerse)
      : null;

  if (
    rawEndVerse &&
    parsedEndVerse === null
  ) {
    return null;
  }

  /*
   * Do not force endVerse to equal startVerse.
   *
   * A single verse should be represented as:
   *
   * {
   *   startVerse: 16,
   *   endVerse: undefined
   * }
   *
   * This keeps the distinction between:
   *
   * John 3:16
   *
   * and:
   *
   * John 3:16-18
   */
  return {
    bookId: book.id,
    bookName: book.name,
    chapter,
    startVerse,
    endVerse:
      parsedEndVerse ?? undefined,
  };
}