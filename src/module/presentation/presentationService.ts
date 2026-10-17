import type {
  PresentationDirection,
  PresentationState,
  PresentationVerse,
} from "./presentation.types";

class PresentationService {
  private state: PresentationState = {
    visible: false,

    reference: null,

    translationId: null,
    translationName: null,

    bookName: null,
    chapter: null,

    verses: [],

    currentVerseIndex: null,
    currentVerse: null,

    hasPreviousVerse: false,
    hasNextVerse: false,

    navigationDirection: null,

    updatedAt: null,
  };

  getState(): PresentationState {
    return this.state;
  }

  /**
   * Load and display a new scripture passage.
   *
   * The entire passage remains available in the
   * state while currentVerseIndex determines the
   * verse currently being presented.
   */
  showScripture(data: {
    reference: string;
    translationId: string;
    translationName: string;
    bookName: string;
    chapter: number;
    verses: PresentationVerse[];
  }): PresentationState {
    const referenceVerseIndex =
      this.findReferenceVerseIndex(
        data.reference,
        data.verses,
      );

    const currentVerseIndex =
      referenceVerseIndex >= 0
        ? referenceVerseIndex
        : data.verses.length > 0
          ? 0
          : null;

    this.state = this.buildState({
      visible: true,

      reference: data.reference,

      translationId:
        data.translationId,

      translationName:
        data.translationName,

      bookName:
        data.bookName,

      chapter:
        data.chapter,

      verses:
        data.verses,

      currentVerseIndex,

      navigationDirection:
        "INITIAL",
    });

    return this.state;
  }

  /**
   * Move to the next verse.
   *
   * Used by:
   * - Next button
   * - Right Arrow keyboard shortcut
   * - Space keyboard shortcut
   */
  nextVerse(): PresentationState {
    if (!this.canNavigate()) {
      return this.state;
    }

    const currentIndex =
      this.state.currentVerseIndex!;

    const nextIndex =
      currentIndex + 1;

    if (
      nextIndex >=
      this.state.verses.length
    ) {
      return this.state;
    }

    this.state = this.buildState({
      ...this.state,

      currentVerseIndex:
        nextIndex,

      navigationDirection:
        "NEXT",
    });

    return this.state;
  }

  /**
   * Move to the previous verse.
   *
   * Used by:
   * - Previous button
   * - Left Arrow keyboard shortcut
   */
  previousVerse(): PresentationState {
    if (!this.canNavigate()) {
      return this.state;
    }

    const currentIndex =
      this.state.currentVerseIndex!;

    const previousIndex =
      currentIndex - 1;

    if (previousIndex < 0) {
      return this.state;
    }

    this.state = this.buildState({
      ...this.state,

      currentVerseIndex:
        previousIndex,

      navigationDirection:
        "PREVIOUS",
    });

    return this.state;
  }

  /**
   * Directly jump to a specific verse.
   *
   * This is independent of nextVerse() and
   * previousVerse().
   *
   * It allows the operator to click ANY verse
   * in the VerseNavigator and immediately make
   * that verse the active presentation verse.
   */
  goToVerse(
    verseNumber: number,
  ): PresentationState {
    if (
      !this.state.visible ||
      this.state.verses.length === 0
    ) {
      return this.state;
    }

    if (
      !Number.isInteger(verseNumber) ||
      verseNumber < 1
    ) {
      return this.state;
    }

    const verseIndex =
      this.state.verses.findIndex(
        (verse) =>
          verse.verse === verseNumber,
      );

    if (verseIndex === -1) {
      return this.state;
    }

    this.state = this.buildState({
      ...this.state,

      currentVerseIndex:
        verseIndex,

      navigationDirection:
        "DIRECT",
    });

    return this.state;
  }

  /**
   * Hide the current scripture while
   * preserving the loaded passage.
   */
  hide(): PresentationState {
    this.state = {
      ...this.state,

      visible: false,

      updatedAt:
        new Date().toISOString(),
    };

    return this.state;
  }

  /**
   * Completely reset the presentation state.
   */
  clear(): PresentationState {
    this.state = {
      visible: false,

      reference: null,

      translationId: null,
      translationName: null,

      bookName: null,
      chapter: null,

      verses: [],

      currentVerseIndex: null,
      currentVerse: null,

      hasPreviousVerse: false,
      hasNextVerse: false,

      navigationDirection: null,

      updatedAt:
        new Date().toISOString(),
    };

    return this.state;
  }

  /**
   * Determine whether the presentation has
   * a valid current verse to navigate from.
   */
  private canNavigate(): boolean {
    return (
      this.state.visible &&
      this.state.currentVerseIndex !== null &&
      this.state.verses.length > 0
    );
  }

  /**
   * Build a complete, internally consistent
   * presentation state.
   *
   * Every navigation operation passes through
   * this method so that:
   *
   * - currentVerseIndex
   * - currentVerse
   * - reference
   * - hasPreviousVerse
   * - hasNextVerse
   *
   * always remain synchronized.
   */
  private buildState(data: {
    visible: boolean;

    reference: string | null;

    translationId: string | null;
    translationName: string | null;

    bookName: string | null;
    chapter: number | null;

    verses: PresentationVerse[];

    currentVerseIndex: number | null;

    navigationDirection:
      PresentationDirection | null;
  }): PresentationState {
    const {
      verses,
      currentVerseIndex,
    } = data;

    const selectedVerse =
      currentVerseIndex !== null
        ? verses[currentVerseIndex] ?? null
        : null;

    const currentVerse =
      selectedVerse?.verse ?? null;

    const hasPreviousVerse =
      currentVerseIndex !== null &&
      currentVerseIndex > 0;

    const hasNextVerse =
      currentVerseIndex !== null &&
      currentVerseIndex <
        verses.length - 1;

    /*
     * Once a verse is selected, the displayed
     * reference follows that verse.
     *
     * Example:
     *
     * John 3:16
     *     ↓ direct selection
     * John 3:19
     */
    const reference =
      selectedVerse &&
      data.bookName &&
      data.chapter !== null
        ? this.buildReference(
            data.bookName,
            data.chapter,
            selectedVerse,
          )
        : data.reference;

    return {
      visible:
        data.visible,

      reference,

      translationId:
        data.translationId,

      translationName:
        data.translationName,

      bookName:
        data.bookName,

      chapter:
        data.chapter,

      verses,

      currentVerseIndex,

      currentVerse,

      hasPreviousVerse,

      hasNextVerse,

      navigationDirection:
        data.navigationDirection,

      updatedAt:
        new Date().toISOString(),
    };
  }

  /**
   * Extract the first verse number from
   * a Bible reference.
   *
   * Examples:
   *
   * John 3:16
   * → 16
   *
   * John 3:16-18
   * → 16
   *
   * John 3
   * → no explicit verse → 0
   */
  private findReferenceVerseIndex(
    reference: string,
    verses: PresentationVerse[],
  ): number {
    const match =
      reference.match(/:(\d+)/);

    if (!match) {
      return 0;
    }

    const verseNumber =
      Number(match[1]);

    return verses.findIndex(
      (verse) =>
        verse.verse === verseNumber,
    );
  }

  /**
   * Build the standard Bible reference
   * for the currently selected verse.
   */
  private buildReference(
    bookName: string,
    chapter: number,
    verse: PresentationVerse,
  ): string {
    return `${bookName} ${chapter}:${verse.verse}`;
  }
}

export const presentationService =
  new PresentationService();