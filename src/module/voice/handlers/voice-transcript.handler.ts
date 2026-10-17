import {
  scriptureDetectorService,
} from "../services/scripture-detector.service";

import {
  transcriptService,
} from "../services/transcript.service";

/*
 * --------------------------------------------------
 * Types
 * --------------------------------------------------
 */

export interface VoiceTranscriptEvent {
  text: string;

  isFinal?: boolean;

  translationId?: string;

  timestamp?: number;
}

export interface VoiceTranscriptResponse {
  success: boolean;

  transcript: string;

  isFinal: boolean;

  scriptureDetected: boolean;

  scripture?: {
    method:
      | "REFERENCE"
      | "TEXT_MATCH";

    confidence:
      | "HIGH"
      | "MEDIUM"
      | "LOW";

    score: number;

    reference: string;

    translationId: string;

    bookId: string;

    bookName: string;

    chapter: number;

    startVerse: number;

    endVerse?: number;

    verses: Array<{
      translationId: string;
      bookId: string;
      bookName: string;
      chapter: number;
      verse: number;
      text: string;
    }>;
  };
}

/*
 * --------------------------------------------------
 * VoiceTranscriptHandler
 * --------------------------------------------------
 */

export class VoiceTranscriptHandler {
  /**
   * Process one transcript event.
   */
  handle(
    event: VoiceTranscriptEvent,
  ): VoiceTranscriptResponse {
    const text =
      event.text?.trim() ?? "";

    const isFinal =
      event.isFinal ?? false;

    if (!text) {
      return {
        success: false,

        transcript: "",

        isFinal,

        scriptureDetected: false,
      };
    }

    /*
     * Update transcript state.
     */
    const state =
      transcriptService.update({
        text,

        isFinal,

        timestamp:
          event.timestamp,
      });

    /*
     * Use the most stable transcript available.
     */
    const detectionText =
      transcriptService.getDetectionText();

    /*
     * Do not search very short speech fragments.
     */
    if (
      !transcriptService.canDetectScripture()
    ) {
      return {
        success: true,

        transcript:
          detectionText ||
          state.currentText ||
          text,

        isFinal,

        scriptureDetected: false,
      };
    }

    /*
     * Run scripture detection.
     */
    const detection =
      scriptureDetectorService.detect(
        detectionText,

        event.translationId,
      );

    if (
      !detection.detected ||
      !detection.reference ||
      !detection.translation ||
      !detection.verse ||
      !detection.verses
    ) {
      return {
        success: true,

        transcript:
          detectionText ||
          text,

        isFinal,

        scriptureDetected: false,
      };
    }

    const verse =
      detection.verse;

    const verses =
      detection.verses;

    const startVerse =
      verses[0]?.verse ??
      verse.verse;

    const endVerse =
      verses.length > 1
        ? verses[
            verses.length - 1
          ].verse
        : undefined;

    return {
      success: true,

      transcript:
        detectionText ||
        text,

      isFinal,

      scriptureDetected: true,

      scripture: {
        method:
          detection.method ??
          "REFERENCE",

        confidence:
          detection.confidence ??
          "LOW",

        score:
          detection.score ??
          0,

        reference:
          detection.reference,

        translationId:
          detection.translation.id,

        bookId:
          verse.bookId,

        bookName:
          verse.bookName,

        chapter:
          verse.chapter,

        startVerse,

        endVerse,

        verses,
      },
    };
  }

  /**
   * Clear transcript state.
   */
  clear(): void {
    transcriptService.clear();
  }

  /**
   * Reset transcript state.
   */
  reset(
    text = "",
  ): void {
    transcriptService.reset(
      text,
    );
  }
}

/*
 * --------------------------------------------------
 * Singleton
 * --------------------------------------------------
 */

export const voiceTranscriptHandler =
  new VoiceTranscriptHandler();
