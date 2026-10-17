export interface PresentationVerse {
  verse: number;
  text: string;
}

export type PresentationDirection =
  | "INITIAL"
  | "NEXT"
  | "PREVIOUS"
  | "DIRECT";

export interface PresentationState {
  visible: boolean;

  reference: string | null;

  translationId: string | null;
  translationName: string | null;

  bookName: string | null;
  chapter: number | null;

  /**
   * All verses currently loaded
   * for the presentation passage.
   */
  verses: PresentationVerse[];

  /**
   * Zero-based index of the verse
   * currently being displayed.
   */
  currentVerseIndex: number | null;

  /**
   * Actual Bible verse number currently
   * being displayed.
   */
  currentVerse: number | null;

  /**
   * Whether the presentation can move
   * to the previous loaded verse.
   */
  hasPreviousVerse: boolean;

  /**
   * Whether the presentation can move
   * to the next loaded verse.
   */
  hasNextVerse: boolean;

  /**
   * Describes how the current verse
   * was selected.
   */
  navigationDirection:
    | PresentationDirection
    | null;

  updatedAt: string | null;
}