export interface BibleBook {
  /**
   * Internal canonical book ID.
   *
   * Examples:
   *
   * genesis
   * john
   * 1-corinthians
   */
  id: string;

  /**
   * Human-readable canonical name.
   *
   * Examples:
   *
   * Genesis
   * John
   * 1 Corinthians
   */
  name: string;

  /**
   * Optional short abbreviation.
   *
   * Examples:
   *
   * Gen
   * Jn
   * 1 Cor
   */
  abbreviation?: string;

  /**
   * Numeric book ID used by the SQLite Bible database.
   */
  databaseId: number;

  /**
   * Testament classification.
   */
  testament?: "OLD" | "NEW";

  /**
   * Number of chapters in the book.
   */
  chapters?: number;
}

/*
 * ------------------------------------------------------------
 * Bible Translation
 * ------------------------------------------------------------
 */

export interface BibleTranslation {
  /**
   * Internal translation ID.
   *
   * Examples:
   *
   * KJV
   * ASV
   * HA_CON
   */
  id: string;

  /**
   * Human-readable translation name.
   *
   * Examples:
   *
   * King James Version
   * American Standard Version
   * Hausa Contemporary
   */
  name: string;

  /**
   * Translation language.
   *
   * Examples:
   *
   * English
   * Hausa
   */
  language: string;

  /**
   * SQLite database identifier.
   *
   * Examples:
   *
   * kjv
   * asv
   * ha_con
   */
  databaseId: string;
}

/*
 * ------------------------------------------------------------
 * Bible Verse
 * ------------------------------------------------------------
 */

export interface BibleVerse {
  /**
   * Translation containing this verse.
   */
  translationId: string;

  /**
   * Canonical Bible book ID.
   */
  bookId: string;

  /**
   * Human-readable Bible book name.
   */
  bookName: string;

  /**
   * Chapter number.
   */
  chapter: number;

  /**
   * Verse number.
   */
  verse: number;

  /**
   * Actual verse text.
   */
  text: string;
}

/*
 * ------------------------------------------------------------
 * Bible Passage
 * ------------------------------------------------------------
 *
 * Represents one or more verses requested from a
 * particular chapter.
 *
 * Examples:
 *
 * John 3:16
 * John 3:16-18
 * Psalm 23:1-6
 * ------------------------------------------------------------
 */

export interface BiblePassage {
  /**
   * Canonical formatted reference.
   *
   * Example:
   *
   * John 3:16
   */
  reference: string;

  /**
   * Translation used to retrieve the passage.
   */
  translation: BibleTranslation;

  /**
   * Bible book containing the passage.
   */
  book: BibleBook;

  /**
   * Chapter containing the passage.
   */
  chapter: number;

  /**
   * First verse in the passage.
   */
  startVerse: number;

  /**
   * Last verse in the passage.
   */
  endVerse: number;

  /**
   * Individual verses making up the passage.
   */
  verses: BibleVerse[];
}

/*
 * ------------------------------------------------------------
 * Bible Search Result
 * ------------------------------------------------------------
 *
 * Normalized result returned by BibleService.
 *
 * This is intentionally similar to BiblePassage but does
 * not expose startVerse/endVerse at the top level.
 *
 * This keeps compatibility with the existing BibleService.
 * ------------------------------------------------------------
 */

export interface BibleSearchResult {
  /**
   * Canonical Bible reference.
   *
   * Example:
   *
   * John 3:16
   */
  reference: string;

  /**
   * Translation used for the result.
   */
  translation: BibleTranslation;

  /**
   * Bible book containing the result.
   */
  book: BibleBook;

  /**
   * Chapter containing the result.
   */
  chapter: number;

  /**
   * Matching verses.
   */
  verses: BibleVerse[];
}

/*
 * ------------------------------------------------------------
 * Parsed Bible Reference
 * ------------------------------------------------------------
 *
 * Represents the result of interpreting a spoken or typed
 * Bible reference.
 *
 * Examples:
 *
 * "John 3:16"
 * "John chapter 3 verse 16"
 * "John chapter three verse sixteen"
 * ------------------------------------------------------------
 */

export interface ParsedBibleReference {
  /**
   * Canonical Bible book ID.
   */
  bookId: string;

  /**
   * Human-readable Bible book name.
   */
  bookName: string;

  /**
   * Chapter number.
   */
  chapter: number;

  /**
   * First verse requested.
   *
   * Optional because chapter-only references are valid.
   *
   * Example:
   *
   * "John chapter 3"
   */
  startVerse?: number;

  /**
   * Last verse requested.
   *
   * Optional because a single verse does not need an
   * explicit end verse.
   */
  endVerse?: number;
}

/*
 * ------------------------------------------------------------
 * Scripture Match Candidate
 * ------------------------------------------------------------
 *
 * A verse that can be compared against recognized pastor
 * speech.
 *
 * Example:
 *
 * Pastor says:
 *
 * "In the beginning was the word"
 *
 * Candidate:
 *
 * John 1:1
 *
 * The scripture matcher calculates how strongly the
 * recognized speech resembles the candidate verse.
 * ------------------------------------------------------------
 */

export interface ScriptureMatchCandidate {
  /**
   * Canonical Bible book ID.
   */
  bookId: string;

  /**
   * Human-readable Bible book name.
   */
  bookName: string;

  /**
   * Chapter containing the candidate verse.
   */
  chapter: number;

  /**
   * Candidate verse number.
   */
  verse: number;

  /**
   * Full verse text.
   */
  text: string;

  /**
   * Optional translation ID.
   */
  translationId?: string;

  /**
   * Optional translation name.
   */
  translationName?: string;
}

/*
 * ------------------------------------------------------------
 * Scripture Match Confidence
 * ------------------------------------------------------------
 */

export type ScriptureMatchConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

/*
 * ------------------------------------------------------------
 * Scripture Match Result
 * ------------------------------------------------------------
 *
 * Result produced when recognized speech is compared
 * against one or more Bible verses.
 * ------------------------------------------------------------
 */

export interface ScriptureMatchResult {
  /**
   * Best matching Bible verse.
   */
  candidate: ScriptureMatchCandidate;

  /**
   * Normalized similarity score between 0 and 1.
   */
  score: number;

  /**
   * Human-readable confidence classification.
   */
  confidence: ScriptureMatchConfidence;

  /**
   * Number of meaningful spoken words that matched.
   */
  matchedWords: number;

  /**
   * Number of meaningful spoken words considered.
   */
  totalSpokenWords: number;

  /**
   * Number of meaningful words in the candidate verse.
   */
  totalVerseWords: number;
}

/*
 * ------------------------------------------------------------
 * Voice Scripture Detection
 * ------------------------------------------------------------
 *
 * This represents the output of the voice-processing layer.
 *
 * There are two fundamentally different ways the pastor can
 * call a scripture:
 *
 * 1. Explicit reference
 *
 *    "John chapter one verse one"
 *
 * 2. Scripture text
 *
 *    "In the beginning was the Word"
 *
 * The detector should preserve which mechanism produced the
 * result.
 * ------------------------------------------------------------
 */

export type ScriptureDetectionType =
  | "REFERENCE"
  | "TEXT";

/*
 * ------------------------------------------------------------
 * Detected Scripture
 * ------------------------------------------------------------
 *
 * This is the normalized object that can eventually be sent
 * to the presentation layer.
 * ------------------------------------------------------------
 */

export interface DetectedScripture {
  /**
   * How the scripture was detected.
   */
  type: ScriptureDetectionType;

  /**
   * Original recognized speech.
   */
  transcript: string;

  /**
   * Canonical Bible reference.
   *
   * Example:
   *
   * John 1:1
   */
  reference: string;

  /**
   * Translation used for matching/retrieval.
   */
  translationId: string;

  /**
   * Matched Bible book.
   */
  book: BibleBook;

  /**
   * Chapter number.
   */
  chapter: number;

  /**
   * First matched/requested verse.
   */
  startVerse: number;

  /**
   * Optional final verse when a range was detected.
   */
  endVerse?: number;

  /**
   * Retrieved Bible verses.
   */
  verses: BibleVerse[];

  /**
   * Matching confidence.
   *
   * Explicit references can normally be treated as HIGH
   * once the reference resolves successfully.
   */
  confidence: ScriptureMatchConfidence;

  /**
   * Numerical confidence score between 0 and 1.
   */
  score: number;
}

/*
 * ------------------------------------------------------------
 * Voice Scripture Detection Result
 * ------------------------------------------------------------
 *
 * This allows the voice pipeline to distinguish:
 *
 * - no scripture detected
 * - scripture detected
 * ------------------------------------------------------------
 */

export interface ScriptureDetectionResult {
  detected: boolean;

  scripture?: DetectedScripture;
}

/*
 * ------------------------------------------------------------
 * Presentation Scripture
 * ------------------------------------------------------------
 *
 * This is the minimal scripture payload required by the
 * presentation layer.
 *
 * It deliberately does not contain voice-specific metadata.
 * ------------------------------------------------------------
 */

export interface PresentationScripture {
  reference: string;

  translationId: string;

  bookId: string;

  bookName: string;

  chapter: number;

  startVerse: number;

  endVerse?: number;

  verses: BibleVerse[];
}
