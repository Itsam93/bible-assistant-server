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
};

const BOOK_ALIASES: Record<string, string> = {
  gen: "Genesis",
  genesis: "Genesis",

  exod: "Exodus",
  exodus: "Exodus",

  lev: "Leviticus",
  leviticus: "Leviticus",

  num: "Numbers",
  numbers: "Numbers",

  deut: "Deuteronomy",
  deuteronomy: "Deuteronomy",

  josh: "Joshua",
  joshua: "Joshua",

  judg: "Judges",
  judges: "Judges",

  ruth: "Ruth",

  "1 sam": "1 Samuel",
  "1 samuel": "1 Samuel",
  "first samuel": "1 Samuel",

  "2 sam": "2 Samuel",
  "2 samuel": "2 Samuel",
  "second samuel": "2 Samuel",

  "1 kgs": "1 Kings",
  "1 kings": "1 Kings",
  "first kings": "1 Kings",

  "2 kgs": "2 Kings",
  "2 kings": "2 Kings",
  "second kings": "2 Kings",

  "1 chr": "1 Chronicles",
  "1 chron": "1 Chronicles",
  "1 chronicles": "1 Chronicles",
  "first chronicles": "1 Chronicles",

  "2 chr": "2 Chronicles",
  "2 chron": "2 Chronicles",
  "2 chronicles": "2 Chronicles",
  "second chronicles": "2 Chronicles",

  ezra: "Ezra",

  neh: "Nehemiah",
  nehemiah: "Nehemiah",

  esth: "Esther",
  esther: "Esther",

  job: "Job",

  ps: "Psalms",
  psalm: "Psalms",
  psalms: "Psalms",

  prov: "Proverbs",
  proverbs: "Proverbs",

  eccl: "Ecclesiastes",
  ecclesiastes: "Ecclesiastes",

  song: "Song of Solomon",
  "song of solomon": "Song of Solomon",
  "song of songs": "Song of Solomon",

  isa: "Isaiah",
  isaiah: "Isaiah",

  jer: "Jeremiah",
  jeremiah: "Jeremiah",

  lam: "Lamentations",
  lamentations: "Lamentations",

  ezek: "Ezekiel",
  ezekiel: "Ezekiel",

  dan: "Daniel",
  daniel: "Daniel",

  hos: "Hosea",
  hosea: "Hosea",

  joel: "Joel",

  amos: "Amos",

  obad: "Obadiah",
  obadiah: "Obadiah",

  jon: "Jonah",
  jonah: "Jonah",

  mic: "Micah",
  micah: "Micah",

  nah: "Nahum",
  nahum: "Nahum",

  hab: "Habakkuk",
  habakkuk: "Habakkuk",

  zeph: "Zephaniah",
  zephaniah: "Zephaniah",

  hag: "Haggai",
  haggai: "Haggai",

  zech: "Zechariah",
  zechariah: "Zechariah",

  mal: "Malachi",
  malachi: "Malachi",

  matt: "Matthew",
  matthew: "Matthew",

  mk: "Mark",
  mark: "Mark",

  lk: "Luke",
  luke: "Luke",

  jn: "John",
  john: "John",

  acts: "Acts",

  rom: "Romans",
  romans: "Romans",

  "1 cor": "1 Corinthians",
  "1 corinthians": "1 Corinthians",
  "first corinthians": "1 Corinthians",

  "2 cor": "2 Corinthians",
  "2 corinthians": "2 Corinthians",
  "second corinthians": "2 Corinthians",

  gal: "Galatians",
  galatians: "Galatians",

  eph: "Ephesians",
  ephesians: "Ephesians",

  phil: "Philippians",
  philippians: "Philippians",

  col: "Colossians",
  colossians: "Colossians",

  "1 thess": "1 Thessalonians",
  "1 thessalonians": "1 Thessalonians",
  "first thessalonians": "1 Thessalonians",

  "2 thess": "2 Thessalonians",
  "2 thessalonians": "2 Thessalonians",
  "second thessalonians": "2 Thessalonians",

  "1 tim": "1 Timothy",
  "1 timothy": "1 Timothy",
  "first timothy": "1 Timothy",

  "2 tim": "2 Timothy",
  "2 timothy": "2 Timothy",
  "second timothy": "2 Timothy",

  tit: "Titus",
  titus: "Titus",

  philem: "Philemon",
  philemon: "Philemon",

  heb: "Hebrews",
  hebrews: "Hebrews",

  jas: "James",
  james: "James",

  "1 pet": "1 Peter",
  "1 peter": "1 Peter",
  "first peter": "1 Peter",

  "2 pet": "2 Peter",
  "2 peter": "2 Peter",
  "second peter": "2 Peter",

  "1 jn": "1 John",
  "1 john": "1 John",
  "first john": "1 John",

  "2 jn": "2 John",
  "2 john": "2 John",
  "second john": "2 John",

  "3 jn": "3 John",
  "3 john": "3 John",
  "third john": "3 John",

  jude: "Jude",

  rev: "Revelation",
  revelation: "Revelation",
};

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function numberWordToNumber(
  value: string,
): number | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/-/g, " ");

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  if (
    NUMBER_WORDS[normalized] !==
    undefined
  ) {
    return NUMBER_WORDS[normalized];
  }

  const parts = normalized.split(" ");

  if (parts.length !== 2) {
    return null;
  }

  const tens =
    NUMBER_WORDS[parts[0]];

  const ones =
    NUMBER_WORDS[parts[1]];

  if (
    tens === undefined ||
    ones === undefined ||
    tens < 20 ||
    ones < 1 ||
    ones > 9
  ) {
    return null;
  }

  return tens + ones;
}

function normalizeNumberWords(
  value: string,
): string {
  return value.replace(
    /\b(?:\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[-\s]+(?:one|two|three|four|five|six|seven|eight|nine))?\b/gi,
    (match) => {
      const number =
        numberWordToNumber(match);

      return number === null
        ? match
        : String(number);
    },
  );
}

function normalizeBookPrefix(
  value: string,
): string {
  return value
    .replace(
      /\bfirst\s+/gi,
      "1 ",
    )
    .replace(
      /\bsecond\s+/gi,
      "2 ",
    )
    .replace(
      /\bthird\s+/gi,
      "3 ",
    );
}

function normalizeBookName(
  value: string,
): string {
  const normalized =
    normalizeWhitespace(
      value.toLowerCase(),
    );

  return (
    BOOK_ALIASES[normalized] ??
    value.trim()
  );
}

function cleanSpeech(
  value: string,
): string {
  let result =
    value
      .toLowerCase()
      .trim();

  result =
    result.replace(
      /[.,!?]+/g,
      " ",
    );

  result =
    normalizeBookPrefix(
      result,
    );

  result =
    normalizeNumberWords(
      result,
    );

  result =
    result.replace(
      /\bchapter(s)?\b/gi,
      " ",
    );

  result =
    result.replace(
      /\bverse(s)?\b/gi,
      " ",
    );

  result =
    result.replace(
      /\bthrough\b/gi,
      "-",
    );

  result =
    result.replace(
      /\bto\b/gi,
      "-",
    );

  result =
    result.replace(
      /\band\b/gi,
      " ",
    );

  return normalizeWhitespace(
    result,
  );
}

/**
 * Converts natural spoken Bible references
 * into the canonical reference format used
 * by the Bible API.
 *
 * Examples:
 *
 * "John chapter three verse sixteen"
 * → "John 3:16"
 *
 * "John chapter three verses sixteen through eighteen"
 * → "John 3:16-18"
 *
 * "Psalm twenty three"
 * → "Psalms 23"
 *
 * "First Corinthians thirteen four"
 * → "1 Corinthians 13:4"
 */
export function parseSpokenBibleReference(
  spokenText: string,
): string {
  if (!spokenText.trim()) {
    return "";
  }

  let value =
    cleanSpeech(
      spokenText,
    );

  /*
   * Remove common voice-command words
   * that may surround a reference.
   */
  value =
    value.replace(
      /^(please\s+)?(show|read|display|present|go to|open)\s+/i,
      "",
    );

  value =
    value.replace(
      /\s+(please)?(present|show|read|display)$/i,
      "",
    );

  value =
    normalizeWhitespace(
      value,
    );

  /*
   * Match:
   *
   * John 3:16
   * John 3 16
   * John 3:16-18
   * John 3 16-18
   */
  const explicitVerseMatch =
    value.match(
      /^(.+?)\s+(\d+)\s*[:]\s*(\d+)(?:\s*-\s*(\d+))?$/,
    );

  if (
    explicitVerseMatch
  ) {
    const book =
      normalizeBookName(
        explicitVerseMatch[1],
      );

    const chapter =
      explicitVerseMatch[2];

    const startVerse =
      explicitVerseMatch[3];

    const endVerse =
      explicitVerseMatch[4];

    return endVerse
      ? `${book} ${chapter}:${startVerse}-${endVerse}`
      : `${book} ${chapter}:${startVerse}`;
  }

  /*
   * Match speech where punctuation was
   * omitted:
   *
   * John 3 16
   */
  const separatedNumbers =
    value.match(
      /^(.+?)\s+(\d+)\s+(\d+)(?:\s*-\s*(\d+))?$/,
    );

  if (
    separatedNumbers
  ) {
    const book =
      normalizeBookName(
        separatedNumbers[1],
      );

    const chapter =
      separatedNumbers[2];

    const startVerse =
      separatedNumbers[3];

    const endVerse =
      separatedNumbers[4];

    return endVerse
      ? `${book} ${chapter}:${startVerse}-${endVerse}`
      : `${book} ${chapter}:${startVerse}`;
  }

  /*
   * Chapter-only reference:
   *
   * Psalm 23
   * John 3
   * Revelation 21
   */
  const chapterMatch =
    value.match(
      /^(.+?)\s+(\d+)$/,
    );

  if (chapterMatch) {
    const book =
      normalizeBookName(
        chapterMatch[1],
      );

    return `${book} ${chapterMatch[2]}`;
  }

  /*
   * Handle references already returned
   * in canonical form.
   */
  const canonicalMatch =
    value.match(
      /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/,
    );

  if (canonicalMatch) {
    const book =
      normalizeBookName(
        canonicalMatch[1],
      );

    return canonicalMatch[4]
      ? `${book} ${canonicalMatch[2]}:${canonicalMatch[3]}-${canonicalMatch[4]}`
      : `${book} ${canonicalMatch[2]}:${canonicalMatch[3]}`;
  }

  return normalizeBookName(
    value,
  );
}