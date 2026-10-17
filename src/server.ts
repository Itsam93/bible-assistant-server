import http from "node:http";

import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import bibleRoutes from "./module/bible/bibleRoutes";

import presentationRoutes from "./module/presentation/presentationRoutes";

import {
  presentationService,
} from "./module/presentation/presentationService";

import {
  registerVoiceSocketHandlers,
} from "./module/voice/handlers/voice.socket-handler";

/*
 * --------------------------------------------------
 * Application
 * --------------------------------------------------
 */

const app = express();

const httpServer =
  http.createServer(app);

/*
 * --------------------------------------------------
 * Configuration
 * --------------------------------------------------
 */

const PORT = Number(
  process.env.PORT ?? 5000,
);

const CLIENT_URL =
  process.env.CLIENT_URL ??
  "http://localhost:5173";

/*
 * --------------------------------------------------
 * Middleware
 * --------------------------------------------------
 */

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  express.json(),
);

/*
 * --------------------------------------------------
 * Health Check
 * --------------------------------------------------
 */

app.get(
  "/api/health",
  (_req, res) => {
    res.status(200).json({
      success: true,

      service:
        "ai-bible-presenter",

      status:
        "ok",
    });
  },
);

/*
 * --------------------------------------------------
 * Bible API
 * --------------------------------------------------
 */

app.use(
  "/api/bible",
  bibleRoutes,
);

/*
 * --------------------------------------------------
 * Socket.IO
 * --------------------------------------------------
 *
 * A single Socket.IO server is shared by:
 *
 * - Presentation
 * - Voice
 *
 * The individual modules register their own
 * socket event handlers.
 * --------------------------------------------------
 */

const io =
  new Server(
    httpServer,
    {
      cors: {
        origin:
          CLIENT_URL,

        credentials:
          true,
      },
    },
  );

/*
 * --------------------------------------------------
 * Presentation API
 * --------------------------------------------------
 *
 * Presentation HTTP routes receive the same
 * Socket.IO instance so that state changes can
 * immediately be broadcast to connected clients.
 * --------------------------------------------------
 */

app.use(
  "/api/presentation",
  presentationRoutes(io),
);

/*
 * --------------------------------------------------
 * Socket.IO Connections
 * --------------------------------------------------
 */

io.on(
  "connection",
  (socket) => {
    console.log(
      `[Socket.IO] Client connected: ${socket.id}`,
    );

    /*
     * ------------------------------------------------
     * Presentation State
     * ------------------------------------------------
     *
     * Send the current presentation state immediately
     * to every newly connected client.
     *
     * This allows a presentation/projector client to
     * recover the currently active scripture after
     * connecting or refreshing.
     * ------------------------------------------------
     */

    socket.emit(
      "presentation:state",
      presentationService.getState(),
    );

    /*
     * ------------------------------------------------
     * Presentation Connection Event
     * ------------------------------------------------
     */

    socket.emit(
      "presentation:connected",
      {
        success: true,

        message:
          "Connected to Bible presentation server.",
      },
    );

    /*
     * ------------------------------------------------
     * Voice Socket Handlers
     * ------------------------------------------------
     *
     * Register:
     *
     * - voice:transcript
     * - voice:clear-transcript
     * - voice:reset-transcript
     * - voice:scripture-detected
     * - voice:transcript-result
     * - voice:error
     *
     * The voice handler owns the voice pipeline.
     * ------------------------------------------------
     */

    registerVoiceSocketHandlers(
      io,
      socket,
    );

    /*
     * ------------------------------------------------
     * Disconnect
     * ------------------------------------------------
     */

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          `[Socket.IO] Client disconnected: ${socket.id} (${reason})`,
        );
      },
    );
  },
);

/*
 * --------------------------------------------------
 * Start Server
 * --------------------------------------------------
 */

httpServer.listen(
  PORT,
  () => {
    console.log(
      `AI Bible Presenter server running on http://localhost:${PORT}`,
    );

    console.log(
      `Bible API: http://localhost:${PORT}/api/bible`,
    );

    console.log(
      `Presentation API: http://localhost:${PORT}/api/presentation`,
    );

    console.log(
      `Socket.IO: ws://localhost:${PORT}`,
    );
  },
);