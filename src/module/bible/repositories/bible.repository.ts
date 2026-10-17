import type {
  BiblePassage,
  BibleVerse,
} from "../bible.types";

export interface BibleRepository {
  /**
   * Get a single Bible verse.
   */
  getVerse(
    translationId: string,
    bookId: string,
    chapter: number,
    verse: number,
  ): BibleVerse | null;

  /**
   * Get a Bible passage.
   *
   * When a verse range is supplied,
   * return all verses within that range.
   */
  getPassage(
    translationId: string,
    bookId: string,
    chapter: number,
    startVerse?: number,
    endVerse?: number,
  ): BiblePassage | null;

  /**
   * Search Bible verse text for a spoken phrase
   * and return the best matching verse.
   *
   * This is used when the operator speaks the
   * words of a Bible verse instead of saying
   * its reference.
   */
  searchVerseText(
    translationId: string,
    text: string,
  ): BibleVerse | null;
}