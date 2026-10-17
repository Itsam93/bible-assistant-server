
import http from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import bibleRoutes from "./module/bible/bibleRoutes";
import presentationRoutes from "./module/presentation/presentationRoutes";
import { presentationService } from "./module/presentation/presentationService";
import { registerVoiceSocketHandlers } from "./module/voice/handlers/voice.socket-handler";

const app = express();
const httpServer = http.createServer(app);

const PORT = Number(process.env.PORT ?? 5000);

const configuredOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS?.split(",") ?? []),
]
  .map((origin) => origin?.trim().replace(/\/+$/, ""))
  .filter((origin): origin is string => Boolean(origin));

const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:5173", "http://localhost:5174"]
      : []),
  ]),
];

if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  throw new Error(
    "Configure CLIENT_URL or CLIENT_URLS with your deployed frontend origin.",
  );
}

const isAllowedOrigin = (
  origin: string | undefined,
): boolean => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(origin.replace(/\/+$/, ""));
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "ai-bible-presenter",
    status: "ok",
  });
});

app.use("/api/bible", bibleRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(
  "/api/presentation",
  presentationRoutes(io),
);

io.on("connection", (socket) => {
  console.log(
    `[Socket.IO] Client connected: ${socket.id}; origin: ${
      socket.handshake.headers.origin ?? "unknown"
    }`,
  );

  // Send the authoritative current state to the new client.
  socket.emit(
    "presentation:state",
    presentationService.getState(),
  );

  socket.emit("presentation:connected", {
    success: true,
    message: "Connected to Bible presentation server.",
  });

  registerVoiceSocketHandlers(io, socket);

  socket.on("disconnect", (reason) => {
    console.log(
      `[Socket.IO] Client disconnected: ${socket.id} (${reason})`,
    );
  });
});

httpServer.listen(PORT, () => {
  console.log(`Bible Presenter server listening on port ${PORT}`);
  console.log("Allowed frontend origins:", allowedOrigins);
  console.log(`Health check: /api/health`);
});
