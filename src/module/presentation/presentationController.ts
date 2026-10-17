import type {
  Request,
  Response,
} from "express";

import type {
  Server,
} from "socket.io";

import {
  bibleService,
} from "../bible/bible.service";

import {
  presentationService,
} from "./presentationService";

/**
 * Get the current presentation state.
 */
export function getPresentationState(
  _req: Request,
  res: Response,
): void {
  const state =
    presentationService.getState();

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Resolve a Bible reference and display
 * the resulting scripture.
 *
 * The resolved passage becomes the active
 * presentation passage, with the detected
 * verse selected as the current verse.
 */
export function showScripture(
  req: Request,
  res: Response,
  io: Server,
): void {
  const reference =
    typeof req.body?.reference === "string"
      ? req.body.reference.trim()
      : "";

  const translation =
    typeof req.body?.translation === "string" &&
    req.body.translation.trim()
      ? req.body.translation.trim()
      : "KJV";

  if (!reference) {
    res.status(400).json({
      success: false,
      message:
        "Bible reference is required.",
    });

    return;
  }

  const result =
    bibleService.searchReference(
      reference,
      translation,
    );

  if (!result) {
    res.status(404).json({
      success: false,
      message:
        `Bible reference "${reference}" could not be resolved.`,
    });

    return;
  }

  const state =
    presentationService.showScripture({
      reference:
        result.reference,

      translationId:
        result.translation.id,

      translationName:
        result.translation.name,

      bookName:
        result.book.name,

      chapter:
        result.chapter,

      verses:
        result.verses.map(
          (verse) => ({
            verse:
              verse.verse,
            text:
              verse.text,
          }),
        ),
    });

  /**
   * Broadcast the complete presentation state
   * to every connected presentation client.
   */
  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Display the next verse in the currently
 * loaded passage.
 *
 * If the current verse is already the last
 * verse in the passage, the current state
 * is returned unchanged.
 */
export function nextVerse(
  _req: Request,
  res: Response,
  io: Server,
): void {
  const state =
    presentationService.nextVerse();

  /**
   * Keep all connected presentation clients
   * synchronized with the new verse.
   */
  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Display the previous verse in the currently
 * loaded passage.
 *
 * If the current verse is already the first
 * verse in the passage, the current state
 * is returned unchanged.
 */
export function previousVerse(
  _req: Request,
  res: Response,
  io: Server,
): void {
  const state =
    presentationService.previousVerse();

  /**
   * Keep all connected presentation clients
   * synchronized with the new verse.
   */
  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Jump directly to a specific verse within
 * the currently loaded passage.
 *
 * This endpoint is used when the operator
 * clicks a verse directly in VerseNavigator.
 *
 * Expected request body:
 *
 * {
 *   verseNumber: 17
 * }
 */
export function goToVerse(
  req: Request,
  res: Response,
  io: Server,
): void {
  /*
   * IMPORTANT:
   *
   * The frontend sends `verseNumber`, not `verse`.
   */
  const verseNumber =
    Number(req.body?.verseNumber);

  if (
    !Number.isInteger(verseNumber) ||
    verseNumber < 1
  ) {
    res.status(400).json({
      success: false,
      message:
        "A valid verse number is required.",
    });

    return;
  }

  const currentState =
    presentationService.getState();

  /*
   * A direct verse selection only makes sense
   * when a passage is currently loaded and visible.
   */
  if (
    !currentState.visible ||
    currentState.verses.length === 0
  ) {
    res.status(400).json({
      success: false,
      message:
        "No scripture is currently loaded.",
    });

    return;
  }

  /*
   * Verify that the requested verse actually
   * exists in the currently loaded passage.
   */
  const verseExists =
    currentState.verses.some(
      (verse) =>
        verse.verse === verseNumber,
    );

  if (!verseExists) {
    res.status(404).json({
      success: false,
      message:
        `Verse ${verseNumber} is not available in the current passage.`,
    });

    return;
  }

  /*
   * Perform the actual state transition.
   *
   * This changes currentVerseIndex,
   * currentVerse, reference and navigation
   * metadata through presentationService.
   */
  const state =
    presentationService.goToVerse(
      verseNumber,
    );

  /*
   * Broadcast the DIRECT navigation to every
   * connected presentation client.
   *
   * This keeps the projector/presentation view
   * synchronized with the operator.
   */
  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Hide the current scripture while
 * preserving its data in memory.
 *
 * The presentation can be shown again
 * without resolving the scripture again.
 */
export function hidePresentation(
  _req: Request,
  res: Response,
  io: Server,
): void {
  const state =
    presentationService.hide();

  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}

/**
 * Completely clear the presentation,
 * including the currently loaded scripture.
 */
export function clearPresentation(
  _req: Request,
  res: Response,
  io: Server,
): void {
  const state =
    presentationService.clear();

  io.emit(
    "presentation:state",
    state,
  );

  res.status(200).json({
    success: true,
    data: state,
  });
}