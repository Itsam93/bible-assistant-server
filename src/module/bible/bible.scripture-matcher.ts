export interface ScriptureMatchCandidate {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translationId?: string;
  translationName?: string;
}

export interface ScriptureMatchResult {
  candidate: ScriptureMatchCandidate;
  score: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchedWords: number;
  totalSpokenWords: number;
  totalVerseWords: number;
}

/*
 * --------------------------------------------------
 * Configuration
 * --------------------------------------------------
 */

const MATCH_CONFIG = {
  minimumWords: 3,

  highConfidenceScore: 0.78,

  mediumConfidenceScore: 0.55,

  stopWords: new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "he",
    "her",
    "his",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "or",
    "our",
    "that",
    "the",
    "their",
    "them",
    "there",
    "these",
    "they",
    "this",
    "to",
    "was",
    "we",
    "were",
    "with",
    "you",
    "your",
  ]),
};

/*
 * --------------------------------------------------
 * Text normalization
 * --------------------------------------------------
 */

export function normalizeScriptureText(
  input: string,
): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * --------------------------------------------------
 * Tokenization
 * --------------------------------------------------
 */

function tokenize(
  input: string,
): string[] {
  const normalized =
    normalizeScriptureText(input);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * Stop-word removal
 * --------------------------------------------------
 */

function removeStopWords(
  words: string[],
): string[] {
  return words.filter(
    (word) =>
      !MATCH_CONFIG.stopWords.has(
        word,
      ),
  );
}

/*
 * --------------------------------------------------
 * Conservative word normalization
 * --------------------------------------------------
 */

function normalizeWord(
  word: string,
): string {
  let result = word;

  /*
   * loving → lov
   *
   * This is intentionally conservative.
   */
  if (
    result.length > 5 &&
    result.endsWith("ing")
  ) {
    result = result.slice(
      0,
      -3,
    );
  }

  /*
   * loved → lov
   */
  if (
    result.length > 4 &&
    result.endsWith("ed")
  ) {
    result = result.slice(
      0,
      -2,
    );
  }

  /*
   * believes → believ
   */
  if (
    result.length > 4 &&
    result.endsWith("es")
  ) {
    result = result.slice(
      0,
      -2,
    );
  }

  /*
   * words → word
   */
  if (
    result.length > 3 &&
    result.endsWith("s")
  ) {
    result = result.slice(
      0,
      -1,
    );
  }

  return result;
}

/*
 * --------------------------------------------------
 * Create normalized word set
 * --------------------------------------------------
 */

function createWordSet(
  words: string[],
): Set<string> {
  return new Set(
    words.map(
      normalizeWord,
    ),
  );
}

/*
 * --------------------------------------------------
 * Calculate word overlap
 * --------------------------------------------------
 */

function calculateWordOverlap(
  spokenWords: string[],
  verseWords: string[],
): number {
  if (
    spokenWords.length === 0 ||
    verseWords.length === 0
  ) {
    return 0;
  }

  const spokenSet =
    createWordSet(
      spokenWords,
    );

  const verseSet =
    createWordSet(
      verseWords,
    );

  if (
    spokenSet.size === 0
  ) {
    return 0;
  }

  let matched = 0;

  for (
    const word of spokenSet
  ) {
    if (
      verseSet.has(word)
    ) {
      matched += 1;
    }
  }

  return (
    matched /
    spokenSet.size
  );
}

/*
 * --------------------------------------------------
 * Calculate phrase similarity
 * --------------------------------------------------
 *
 * Finds the longest contiguous sequence of normalized
 * words shared by the spoken text and verse.
 * --------------------------------------------------
 */

function calculatePhraseSimilarity(
  spokenWords: string[],
  verseWords: string[],
): number {
  if (
    spokenWords.length === 0 ||
    verseWords.length === 0
  ) {
    return 0;
  }

  const spoken =
    spokenWords.map(
      normalizeWord,
    );

  const verse =
    verseWords.map(
      normalizeWord,
    );

  let longestSequence = 0;

  for (
    let spokenIndex = 0;
    spokenIndex <
    spoken.length;
    spokenIndex += 1
  ) {
    for (
      let verseIndex = 0;
      verseIndex <
      verse.length;
      verseIndex += 1
    ) {
      if (
        spoken[spokenIndex] !==
        verse[verseIndex]
      ) {
        continue;
      }

      let length = 0;

      while (
        spokenIndex + length <
          spoken.length &&
        verseIndex + length <
          verse.length &&
        spoken[
          spokenIndex + length
        ] ===
          verse[
            verseIndex + length
          ]
      ) {
        length += 1;
      }

      if (
        length >
        longestSequence
      ) {
        longestSequence =
          length;
      }
    }
  }

  return (
    longestSequence /
    Math.max(
      spoken.length,
      1,
    )
  );
}

/*
 * --------------------------------------------------
 * Exact phrase containment
 * --------------------------------------------------
 */

function calculatePhraseContainment(
  spokenText: string,
  verseText: string,
): number {
  const spoken =
    normalizeScriptureText(
      spokenText,
    );

  const verse =
    normalizeScriptureText(
      verseText,
    );

  if (
    !spoken ||
    !verse
  ) {
    return 0;
  }

  /*
   * Spoken phrase is contained in verse.
   */
  if (
    verse.includes(spoken)
  ) {
    return 1;
  }

  /*
   * Verse is contained in spoken text.
   *
   * This can occur when speech recognition captures
   * more than one verse.
   */
  if (
    spoken.includes(verse)
  ) {
    return 0.9;
  }

  return 0;
}

/*
 * --------------------------------------------------
 * Calculate final match score
 * --------------------------------------------------
 */

function calculateScore(
  spokenText: string,
  verseText: string,
): {
  score: number;
  matchedWords: number;
  totalSpokenWords: number;
  totalVerseWords: number;
} {
  const spokenTokens =
    tokenize(spokenText);

  const verseTokens =
    tokenize(verseText);

  const spokenWords =
    removeStopWords(
      spokenTokens,
    );

  const verseWords =
    removeStopWords(
      verseTokens,
    );

  if (
    spokenWords.length === 0 ||
    verseWords.length === 0
  ) {
    return {
      score: 0,
      matchedWords: 0,
      totalSpokenWords:
        spokenWords.length,
      totalVerseWords:
        verseWords.length,
    };
  }

  const spokenSet =
    createWordSet(
      spokenWords,
    );

  const verseSet =
    createWordSet(
      verseWords,
    );

  let matchedWords = 0;

  for (
    const word of spokenSet
  ) {
    if (
      verseSet.has(word)
    ) {
      matchedWords += 1;
    }
  }

  const wordOverlap =
    calculateWordOverlap(
      spokenWords,
      verseWords,
    );

  const phraseSimilarity =
    calculatePhraseSimilarity(
      spokenWords,
      verseWords,
    );

  const phraseContainment =
    calculatePhraseContainment(
      spokenText,
      verseText,
    );

  /*
   * Weighted scoring:
   *
   * Word overlap       = 45%
   * Phrase similarity  = 35%
   * Exact containment  = 20%
   */
  let score =
    wordOverlap * 0.45 +
    phraseSimilarity * 0.35 +
    phraseContainment * 0.20;

  /*
   * Exact spoken phrase inside a verse is a very
   * strong signal.
   */
  if (
    phraseContainment === 1
  ) {
    score = Math.max(
      score,
      0.9,
    );
  }

  score = Math.max(
    0,
    Math.min(
      1,
      score,
    ),
  );

  return {
    score,
    matchedWords,
    totalSpokenWords:
      spokenWords.length,
    totalVerseWords:
      verseWords.length,
  };
}

/*
 * --------------------------------------------------
 * Determine confidence
 * --------------------------------------------------
 */

function getConfidence(
  score: number,
):
  | "HIGH"
  | "MEDIUM"
  | "LOW" {
  if (
    score >=
    MATCH_CONFIG.highConfidenceScore
  ) {
    return "HIGH";
  }

  if (
    score >=
    MATCH_CONFIG.mediumConfidenceScore
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

/*
 * --------------------------------------------------
 * Match one scripture candidate
 * --------------------------------------------------
 */

export function matchScriptureCandidate(
  spokenText: string,
  candidate: ScriptureMatchCandidate,
): ScriptureMatchResult | null {
  const spokenWords =
    removeStopWords(
      tokenize(spokenText),
    );

  if (
    spokenWords.length <
    MATCH_CONFIG.minimumWords
  ) {
    return null;
  }

  const result =
    calculateScore(
      spokenText,
      candidate.text,
    );

  if (
    result.score <= 0
  ) {
    return null;
  }

  return {
    candidate,

    score:
      result.score,

    confidence:
      getConfidence(
        result.score,
      ),

    matchedWords:
      result.matchedWords,

    totalSpokenWords:
      result.totalSpokenWords,

    totalVerseWords:
      result.totalVerseWords,
  };
}

/*
 * --------------------------------------------------
 * Match multiple scripture candidates
 * --------------------------------------------------
 */

export function matchScriptureCandidates(
  spokenText: string,
  candidates: ScriptureMatchCandidate[],
): ScriptureMatchResult | null {
  const spokenWords =
    removeStopWords(
      tokenize(spokenText),
    );

  if (
    spokenWords.length <
    MATCH_CONFIG.minimumWords
  ) {
    return null;
  }

  let bestMatch:
    | ScriptureMatchResult
    | null = null;

  for (
    const candidate of candidates
  ) {
    const match =
      matchScriptureCandidate(
        spokenText,
        candidate,
      );

    if (!match) {
      continue;
    }

    if (
      !bestMatch ||
      match.score >
        bestMatch.score
    ) {
      bestMatch = match;
    }
  }

  return bestMatch;
}

/*
 * --------------------------------------------------
 * Find all scripture matches above a threshold
 * --------------------------------------------------
 */

export function findScriptureMatches(
  spokenText: string,
  candidates: ScriptureMatchCandidate[],
  minimumScore =
    MATCH_CONFIG.mediumConfidenceScore,
): ScriptureMatchResult[] {
  const spokenWords =
    removeStopWords(
      tokenize(spokenText),
    );

  if (
    spokenWords.length <
    MATCH_CONFIG.minimumWords
  ) {
    return [];
  }

  const matches: ScriptureMatchResult[] =
    [];

  for (
    const candidate of candidates
  ) {
    const match =
      matchScriptureCandidate(
        spokenText,
        candidate,
      );

    if (!match) {
      continue;
    }

    if (
      match.score >=
      minimumScore
    ) {
      matches.push(match);
    }
  }

  return matches.sort(
    (a, b) =>
      b.score - a.score,
  );
}

/*
 * --------------------------------------------------
 * High-confidence scripture match
 * --------------------------------------------------
 *
 * This helper should be used before automatically
 * changing the presentation.
 * --------------------------------------------------
 */

export function findHighConfidenceScriptureMatch(
  spokenText: string,
  candidates: ScriptureMatchCandidate[],
): ScriptureMatchResult | null {
  const match =
    matchScriptureCandidates(
      spokenText,
      candidates,
    );

  if (!match) {
    return null;
  }

  if (
    match.confidence !==
    "HIGH"
  ) {
    return null;
  }

  return match;
}

/*
 * --------------------------------------------------
 * Determine whether speech contains enough
 * meaningful scripture-like text to search
 * --------------------------------------------------
 */

export function canSearchForScriptureText(
  spokenText: string,
): boolean {
  const words =
    removeStopWords(
      tokenize(spokenText),
    );

  return (
    words.length >=
    MATCH_CONFIG.minimumWords
  );
}
