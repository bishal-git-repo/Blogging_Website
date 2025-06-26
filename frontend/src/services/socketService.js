import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.url = "http://localhost:3000"; // Fixed URL
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.url, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket:", this.socket.id);
      });

      this.socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err.message);
      });
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
