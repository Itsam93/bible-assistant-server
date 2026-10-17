import type {
  Server,
} from "socket.io";

let io: Server | null = null;

export function initializePresentationGateway(
  server: Server,
): void {
  io = server;
}

export function broadcastPresentationState(
  state: unknown,
): void {
  if (!io) {
    return;
  }

  io.emit(
    "presentation:state",
    state,
  );
}