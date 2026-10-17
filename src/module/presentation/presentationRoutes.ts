import {
  Router,
} from "express";

import type {
  Server,
} from "socket.io";

import {
  getPresentationState,
  showScripture,
  nextVerse,
  previousVerse,
  goToVerse,
  hidePresentation,
  clearPresentation,
} from "./presentationController";

export default function presentationRoutes(
  io: Server,
) {
  const router = Router();

  /**
   * GET /api/presentation/state
   *
   * Get the current presentation state.
   */
  router.get(
    "/state",
    getPresentationState,
  );

  /**
   * POST /api/presentation/show
   *
   * Resolve and display a Bible reference.
   */
  router.post(
    "/show",
    (req, res) => {
      showScripture(
        req,
        res,
        io,
      );
    },
  );

  /**
   * POST /api/presentation/next
   *
   * Display the next verse in the
   * currently loaded passage.
   */
  router.post(
    "/next",
    (req, res) => {
      nextVerse(
        req,
        res,
        io,
      );
    },
  );

  /**
   * POST /api/presentation/previous
   *
   * Display the previous verse in the
   * currently loaded passage.
   */
  router.post(
    "/previous",
    (req, res) => {
      previousVerse(
        req,
        res,
        io,
      );
    },
  );

  /**
   * POST /api/presentation/verse
   *
   * Jump directly to a specific verse
   * in the currently loaded passage.
   *
   * Expected body:
   * {
   *   "verse": 5
   * }
   */
  router.post(
    "/verse",
    (req, res) => {
      goToVerse(
        req,
        res,
        io,
      );
    },
  );

  /**
   * POST /api/presentation/hide
   *
   * Temporarily hide the current scripture
   * while preserving its state.
   */
  router.post(
    "/hide",
    (req, res) => {
      hidePresentation(
        req,
        res,
        io,
      );
    },
  );

  /**
   * POST /api/presentation/clear
   *
   * Completely clear the presentation state.
   */
  router.post(
    "/clear",
    (req, res) => {
      clearPresentation(
        req,
        res,
        io,
      );
    },
  );

  return router;
}