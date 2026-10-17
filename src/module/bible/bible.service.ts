import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
} from "./bible.data";

import {
  parseBibleReference,
} from "./bible.reference-parser";

import {
  parseNaturalBibleReference,
} from "./bible.natural-language-parser";

import type {
  BibleBook,
  BibleSearchResult,
  BibleTranslation,
} from "./bible.types";

import {
  localBibleRepository,
} from "./repositories/local-bible.repository";

export class BibleService {
  private readonly repository =
    localBibleRepository;

  /**
   * Get all registered Bible translations.
   */
  getTranslations(): BibleTranslation[] {
    return BIBLE_TRANSLATIONS;
  }

  /**
   * Get all registered Bible books.
   */
  getBooks(): BibleBook[] {
    return BIBLE_BOOKS;
  }

  /**
   * Find a registered translation by ID.
   *
   * Matching is case-insensitive.
   */
  getTranslation(
    translationId: string,
  ): BibleTranslation | undefined {
    const normalizedId =
      translationId
        .trim()
        .toLowerCase();

    return BIBLE_TRANSLATIONS.find(
      (translation) =>
        translation.id.toLowerCase() ===
        normalizedId,
    );
  }

  /**
   * Parse a Bible reference.
   *
   * Supports:
   *
   * - Standard references
   *   "John 3:16"
   *
   * - Natural-language references
   *   "John chapter 3 verse 16"
   */
  parseReference(input: string) {
    const normalizedInput =
      input.trim();

    if (!normalizedInput) {
      return null;
    }

    return (
      parseBibleReference(
        normalizedInput,
      ) ??
      parseNaturalBibleReference(
        normalizedInput,
      )
    );
  }

  /**
   * Resolve a Bible request.
   *
   * Supported input:
   *
   * 1. Standard Bible reference
   *    "John 3:16"
   *
   * 2. Natural-language reference
   *    "John chapter 3 verse 16"
   *
   * 3. Spoken Bible verse text
   *    "For God so loved the world"
   *
   * Resolution order:
   *
   *    Bible reference
   *         ↓
   *    Natural-language reference
   *         ↓
   *    Spoken verse-text search
   *
   * Reference parsing always takes priority.
   */
  searchReference(
    reference: string,
    translationId: string = "KJV",
  ): BibleSearchResult | null {
    const normalizedReference =
      reference.trim();

    if (!normalizedReference) {
      return null;
    }

    /*
     * --------------------------------------------------
     * Resolve translation.
     * --------------------------------------------------
     */
    const translation =
      this.getTranslation(
        translationId,
      );

    if (!translation) {
      return null;
    }

    /*
     * --------------------------------------------------
     * 1. Try Bible reference resolution.
     *
     * Examples:
     *
     * "John 3:16"
     * "Psalm 23:1-3"
     * "John chapter 3 verse 16"
     * --------------------------------------------------
     */
    const parsed =
      this.parseReference(
        normalizedReference,
      );

    if (parsed) {
      const book =
        BIBLE_BOOKS.find(
          (candidate) =>
            candidate.id ===
            parsed.bookId,
        );

      if (book) {
        const passage =
          this.repository.getPassage(
            translation.id,
            book.id,
            parsed.chapter,
            parsed.startVerse,
            parsed.endVerse,
          );

        if (passage) {
          return {
            reference:
              passage.reference,

            translation,

            book,

            chapter:
              passage.chapter,

            verses:
              passage.verses,
          };
        }
      }
    }

    /*
     * --------------------------------------------------
     * 2. Try spoken Bible verse text.
     *
     * Examples:
     *
     * "For God so loved the world"
     *
     * "The Lord is my shepherd"
     *
     * "Jesus wept"
     * --------------------------------------------------
     */
    const matchedVerse =
      this.repository.searchVerseText(
        translation.id,
        normalizedReference,
      );

    if (!matchedVerse) {
      return null;
    }

    /*
     * --------------------------------------------------
     * 3. Convert the matched verse into the normal
     *    BibleSearchResult structure.
     * --------------------------------------------------
     */
    const passage =
      this.repository.getPassage(
        translation.id,
        matchedVerse.bookId,
        matchedVerse.chapter,
        matchedVerse.verse,
        matchedVerse.verse,
      );

    if (!passage) {
      return null;
    }

    return {
      reference:
        passage.reference,

      translation,

      book:
        passage.book,

      chapter:
        passage.chapter,

      verses:
        passage.verses,
    };
  }

  /**
   * Close all locally opened Bible databases.
   */
  close(): void {
    this.repository.close();
  }
}

export const bibleService =
  new BibleService();
