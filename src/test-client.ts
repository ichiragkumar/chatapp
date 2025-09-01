import { io, Socket } from "socket.io-client";
import readline from "readline";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
}

const socket: Socket = io("http://localhost:3000");

const USER_ID = process.argv[2] || "user1";
const RECEIVER_ID = process.argv[3] || "user2";

socket.on("connect", () => {
  console.log(`Connected as ${USER_ID}, socketId: ${socket.id}`);
  socket.emit("join", USER_ID);
  console.log(`Chatting with: ${RECEIVER_ID}`);
});

// Listen for incoming messages
socket.on("receive_message", (data: ChatMessage) => {
  console.log(`${data.senderId}: ${data.message}`);
});

// Setup terminal input for live chat
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  if (input.trim() === "") return;

  const message: ChatMessage = {
    senderId: USER_ID,
    receiverId: RECEIVER_ID,
    message: input,
  };
  socket.emit("send_message", message);
});
