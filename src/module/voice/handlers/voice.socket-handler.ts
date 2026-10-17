import type {
  Server,
  Socket,
} from "socket.io";

import {
  voiceTranscriptHandler,
} from "./voice-transcript.handler";

import {
  presentationService,
} from "../../presentation/presentationService";

/*
 * --------------------------------------------------
 * Socket event names
 * --------------------------------------------------
 *
 * Keep these centralized so the client and server
 * use consistent event names.
 * --------------------------------------------------
 */

export const VOICE_SOCKET_EVENTS = {
  TRANSCRIPT: "voice:transcript",

  SCRIPTURE_DETECTED:
    "voice:scripture-detected",

  TRANSCRIPT_RESULT:
    "voice:transcript-result",

  CLEAR_TRANSCRIPT:
    "voice:clear-transcript",

  RESET_TRANSCRIPT:
    "voice:reset-transcript",

  ERROR:
    "voice:error",
} as const;

/*
 * --------------------------------------------------
 * Incoming event payloads
 * --------------------------------------------------
 */

interface VoiceTranscriptPayload {
  text: string;

  isFinal?: boolean;

  translationId?: string;

  timestamp?: number;
}

interface VoiceResetPayload {
  text?: string;
}

/*
 * --------------------------------------------------
 * Voice Socket Handler
 * --------------------------------------------------
 *
 * Responsibilities:
 *
 * - Listen for transcript events from the client.
 * - Pass transcript data to VoiceTranscriptHandler.
 * - Return normalized transcript results.
 * - Emit scripture detection events.
 * - Automatically load confirmed Scripture into
 *   the presentation service.
 *
 * This layer does NOT:
 *
 * - perform speech recognition
 * - access SQLite directly
 * - parse Bible references directly
 *
 * Bible detection remains inside the voice/Bible
 * service layers.
 *
 * Presentation state remains inside
 * presentationService.
 * --------------------------------------------------
 */

/**
 * Register all voice-related Socket.IO events
 * for a single connected client.
 */
export function registerVoiceSocketHandlers(
  io: Server,
  socket: Socket,
): void {
  /*
   * ------------------------------------------------
   * Transcript
   * ------------------------------------------------
   *
   * Client sends:
   *
   * socket.emit("voice:transcript", {
   *   text: "John chapter three verse sixteen",
   *   isFinal: true,
   *   translationId: "KJV"
   * });
   */
  socket.on(
    VOICE_SOCKET_EVENTS.TRANSCRIPT,
    (
      payload: VoiceTranscriptPayload,
    ) => {
      try {
        /*
         * Validate payload.
         */
        if (
          !payload ||
          typeof payload.text !==
            "string"
        ) {
          socket.emit(
            VOICE_SOCKET_EVENTS.ERROR,
            {
              success: false,

              message:
                "Invalid voice transcript payload.",
            },
          );

          return;
        }

        const text =
          payload.text.trim();

        if (!text) {
          return;
        }

        /*
         * Process transcript through the voice
         * pipeline.
         */
        const result =
          voiceTranscriptHandler.handle({
            text,

            isFinal:
              payload.isFinal ??
              false,

            translationId:
              payload.translationId,

            timestamp:
              payload.timestamp,
          });

        /*
         * Always return the normalized transcript
         * result to the socket that sent it.
         */
        socket.emit(
          VOICE_SOCKET_EVENTS.TRANSCRIPT_RESULT,
          result,
        );

        /*
         * ------------------------------------------------
         * Scripture detected
         * ------------------------------------------------
         *
         * A detected Scripture reference is first
         * reported through the voice event.
         *
         * The presentation is only changed when the
         * transcript is FINAL. This prevents interim
         * speech-recognition results from causing the
         * projector to jump unexpectedly.
         * ------------------------------------------------
         */
        if (
          result.success &&
          result.scriptureDetected &&
          result.scripture
        ) {
          /*
           * Broadcast the detection event.
           *
           * io.emit() already includes the socket
           * that produced the transcript, so there
           * is no need to emit to `socket` separately.
           */
          io.emit(
            VOICE_SOCKET_EVENTS.SCRIPTURE_DETECTED,
            result.scripture,
          );

          /*
           * ------------------------------------------------
           * Automatic presentation
           * ------------------------------------------------
           *
           * Only final transcript results are allowed
           * to change the active presentation.
           *
           * This is important because browser speech
           * recognition commonly produces interim
           * transcript fragments.
           */
          if (
            result.isFinal
          ) {
            const scripture =
              result.scripture;

            /*
             * The detector has already resolved the
             * Bible passage, so there is no second Bible
             * database lookup here.
             */
            const state =
              presentationService.showScripture({
                reference:
                  scripture.reference,

                translationId:
                  scripture.translationId,

                translationName:
                  scripture.translationId,

                bookName:
                  scripture.bookName,

                chapter:
                  scripture.chapter,

                verses:
                  scripture.verses.map(
                    (verse) => ({
                      verse:
                        verse.verse,

                      text:
                        verse.text,
                    }),
                  ),
              });

            /*
             * Broadcast the complete presentation
             * state to all connected clients.
             *
             * This updates the projector/presentation
             * screen immediately.
             */
            io.emit(
              "presentation:state",
              state,
            );
          }
        }
      } catch (error) {
        console.error(
          "[VoiceSocket] Failed to process transcript:",
          error,
        );

        socket.emit(
          VOICE_SOCKET_EVENTS.ERROR,
          {
            success: false,

            message:
              "Failed to process voice transcript.",
          },
        );
      }
    },
  );

  /*
   * ------------------------------------------------
   * Clear transcript
   * ------------------------------------------------
   */
  socket.on(
    VOICE_SOCKET_EVENTS.CLEAR_TRANSCRIPT,
    () => {
      try {
        voiceTranscriptHandler.clear();

        socket.emit(
          VOICE_SOCKET_EVENTS.TRANSCRIPT_RESULT,
          {
            success: true,

            transcript: "",

            isFinal: true,

            scriptureDetected: false,
          },
        );
      } catch (error) {
        console.error(
          "[VoiceSocket] Failed to clear transcript:",
          error,
        );

        socket.emit(
          VOICE_SOCKET_EVENTS.ERROR,
          {
            success: false,

            message:
              "Failed to clear voice transcript.",
          },
        );
      }
    },
  );

  /*
   * ------------------------------------------------
   * Reset transcript
   * ------------------------------------------------
   *
   * This is different from clear because reset can
   * optionally establish a new starting transcript.
   */
  socket.on(
    VOICE_SOCKET_EVENTS.RESET_TRANSCRIPT,
    (
      payload: VoiceResetPayload = {},
    ) => {
      try {
        const text =
          typeof payload.text ===
          "string"
            ? payload.text.trim()
            : "";

        voiceTranscriptHandler.reset(
          text,
        );

        socket.emit(
          VOICE_SOCKET_EVENTS.TRANSCRIPT_RESULT,
          {
            success: true,

            transcript: text,

            isFinal: true,

            scriptureDetected: false,
          },
        );
      } catch (error) {
        console.error(
          "[VoiceSocket] Failed to reset transcript:",
          error,
        );

        socket.emit(
          VOICE_SOCKET_EVENTS.ERROR,
          {
            success: false,

            message:
              "Failed to reset voice transcript.",
          },
        );
      }
    },
  );

  /*
   * ------------------------------------------------
   * Disconnect cleanup
   * ------------------------------------------------
   *
   * We intentionally clear the global transcript
   * state here because the current TranscriptService
   * is a singleton.
   *
   * Later, if multiple microphones/operators need to
   * work independently, transcript state should be
   * moved from the singleton into a per-session store.
   * ------------------------------------------------
   */
  socket.on(
    "disconnect",
    () => {
      try {
        voiceTranscriptHandler.clear();
      } catch (error) {
        console.error(
          "[VoiceSocket] Failed to clean up transcript state:",
          error,
        );
      }
    },
  );
}
