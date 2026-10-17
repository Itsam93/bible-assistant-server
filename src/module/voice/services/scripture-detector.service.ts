import {
  bibleService,
} from "../../bible/bible.service";

import type {
  BibleSearchResult,
  BibleTranslation,
  BibleVerse,
} from "../../bible/bible.types";

import {
  findHighConfidenceScriptureMatch,
  findScriptureMatches,
  matchScriptureCandidates,
  canSearchForScriptureText,
} from "../../bible/bible.scripture-matcher";

import type {
  ScriptureMatchCandidate,
  ScriptureMatchResult,
} from "../../bible/bible.scripture-matcher";

/*
 * --------------------------------------------------
 * Types
 * --------------------------------------------------
 */

export type ScriptureDetectionMethod =
  | "REFERENCE"
  | "TEXT_MATCH";

export type ScriptureDetectionConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface ScriptureDetectionResult {
  detected: boolean;

  method?: ScriptureDetectionMethod;

  confidence?: ScriptureDetectionConfidence;

  score?: number;

  input: string;

  reference?: string;

  translation?: BibleTranslation;

  verse?: BibleVerse;

  verses?: BibleVerse[];

  searchResult?: BibleSearchResult;

  match?: ScriptureMatchResult;
}

/*
 * --------------------------------------------------
 * Configuration
 * --------------------------------------------------
 */

const DETECTOR_CONFIG = {
  defaultTranslationId: "KJV",

  minimumTextMatchScore: 0.55,

  minimumSearchWords: 3,
} as const;

/*
 * --------------------------------------------------
 * ScriptureDetectorService
 * --------------------------------------------------
 */

export class ScriptureDetectorService {
  /**
   * Main scripture detection entry point.
   *
   * Resolution order:
   *
   * 1. Explicit Bible reference
   * 2. Spoken Bible text
   */
  detect(
    transcript: string,
    translationId?: string,
  ): ScriptureDetectionResult {
    const input =
      transcript.trim();

    if (!input) {
      return {
        detected: false,
        input,
      };
    }

    /*
     * Resolve the requested translation.
     *
     * If no translation was supplied, KJV is used.
     */
    const resolvedTranslationId =
      translationId?.trim() ||
      DETECTOR_CONFIG.defaultTranslationId;

    /*
     * Explicit reference gets priority.
     */
    const referenceResult =
      this.detectReference(
        input,
        resolvedTranslationId,
      );

    if (referenceResult) {
      return referenceResult;
    }

    /*
     * Otherwise attempt spoken scripture text
     * matching.
     */
    const textResult =
      this.detectScriptureText(
        input,
        resolvedTranslationId,
      );

    if (textResult) {
      return textResult;
    }

    return {
      detected: false,
      input,
    };
  }

  /**
   * Detect an explicit Bible reference.
   *
   * Examples:
   *
   * John 3:16
   * Psalm 23:1-3
   * John chapter 3 verse 16
   */
  private detectReference(
    input: string,
    translationId: string,
  ): ScriptureDetectionResult | null {
    const parsed =
      bibleService.parseReference(
        input,
      );

    if (!parsed) {
      return null;
    }

    const searchResult =
      bibleService.searchReference(
        input,
        translationId,
      );

    if (!searchResult) {
      return null;
    }

    const firstVerse =
      searchResult.verses[0];

    if (!firstVerse) {
      return null;
    }

    return {
      detected: true,

      method: "REFERENCE",

      confidence: "HIGH",

      score: 1,

      input,

      reference:
        searchResult.reference,

      translation:
        searchResult.translation,

      verse:
        firstVerse,

      verses:
        searchResult.verses,

      searchResult,
    };
  }

  /**
   * Detect scripture from spoken Bible text.
   *
   * Example:
   *
   * "For God so loved the world"
   */
  private detectScriptureText(
    input: string,
    translationId: string,
  ): ScriptureDetectionResult | null {
    if (
      !canSearchForScriptureText(
        input,
      )
    ) {
      return null;
    }

    const translation =
      bibleService.getTranslation(
        translationId,
      );

    if (!translation) {
      return null;
    }

    /*
     * BibleService delegates text searching to the
     * LocalBibleRepository.
     */
    const searchResult =
      bibleService.searchReference(
        input,
        translation.id,
      );

    if (!searchResult) {
      return null;
    }

    const firstVerse =
      searchResult.verses[0];

    if (!firstVerse) {
      return null;
    }

    return {
      detected: true,

      method: "TEXT_MATCH",

      confidence: "HIGH",

      score: 1,

      input,

      reference:
        searchResult.reference,

      translation:
        searchResult.translation,

      verse:
        firstVerse,

      verses:
        searchResult.verses,

      searchResult,
    };
  }

  /**
   * Detect using a supplied list of candidate verses.
   *
   * Useful for indexed or cached scripture matching.
   */
  detectFromCandidates(
    transcript: string,
    candidates: ScriptureMatchCandidate[],
  ): ScriptureDetectionResult | null {
    const input =
      transcript.trim();

    if (!input) {
      return null;
    }

    if (
      candidates.length === 0
    ) {
      return null;
    }

    const match =
      findHighConfidenceScriptureMatch(
        input,
        candidates,
      );

    if (!match) {
      return null;
    }

    return this.createCandidateDetectionResult(
      input,
      match,
    );
  }

  /**
   * Return multiple possible matches.
   */
  findCandidates(
    transcript: string,
    candidates: ScriptureMatchCandidate[],
    minimumScore =
      DETECTOR_CONFIG.minimumTextMatchScore,
  ): ScriptureMatchResult[] {
    const input =
      transcript.trim();

    if (!input) {
      return [];
    }

    if (
      candidates.length === 0
    ) {
      return [];
    }

    return findScriptureMatches(
      input,
      candidates,
      minimumScore,
    );
  }

  /**
   * Return the best candidate without requiring
   * HIGH confidence.
   */
  matchBestCandidate(
    transcript: string,
    candidates: ScriptureMatchCandidate[],
  ): ScriptureMatchResult | null {
    const input =
      transcript.trim();

    if (!input) {
      return null;
    }

    if (
      candidates.length === 0
    ) {
      return null;
    }

    return matchScriptureCandidates(
      input,
      candidates,
    );
  }

  /**
   * Determine whether transcript contains enough
   * text to attempt scripture matching.
   */
  canSearch(
    transcript: string,
  ): boolean {
    const input =
      transcript.trim();

    if (!input) {
      return false;
    }

    return (
      canSearchForScriptureText(
        input,
      ) &&
      this.getWordCount(input) >=
        DETECTOR_CONFIG.minimumSearchWords
    );
  }

  /**
   * Convert a matcher result into a detector result.
   */
  private createCandidateDetectionResult(
    input: string,
    match: ScriptureMatchResult,
  ): ScriptureDetectionResult {
    const candidate =
      match.candidate;

    const translationId =
      candidate.translationId ||
      DETECTOR_CONFIG.defaultTranslationId;

    const verse: BibleVerse = {
      translationId,

      bookId:
        candidate.bookId,

      bookName:
        candidate.bookName,

      chapter:
        candidate.chapter,

      verse:
        candidate.verse,

      text:
        candidate.text,
    };

    return {
      detected: true,

      method: "TEXT_MATCH",

      confidence:
        match.confidence,

      score:
        match.score,

      input,

      reference:
        `${candidate.bookName} ${candidate.chapter}:${candidate.verse}`,

      translation:
        bibleService.getTranslation(
          translationId,
        ),

      verse,

      verses: [
        verse,
      ],

      match,
    };
  }

  /**
   * Count words in a transcript.
   */
  private getWordCount(
    input: string,
  ): number {
    return input
      .toLowerCase()
      .replace(
        /[^a-z0-9\s']/g,
        " ",
      )
      .split(/\s+/)
      .filter(Boolean)
      .length;
  }
}

/*
 * --------------------------------------------------
 * Singleton
 * --------------------------------------------------
 */

export const scriptureDetectorService =
  new ScriptureDetectorService();

/*
 * --------------------------------------------------
 * Re-export matcher search helper.
 *
 * This keeps transcript.service.ts independent of
 * the internal location of the Bible matcher.
 * --------------------------------------------------
 */

export {
  canSearchForScriptureText,
};