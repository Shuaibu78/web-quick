import { io } from "socket.io-client";

const serverAddress = process.env.REACT_APP_LOCAL_SERVER_API;

export const clientSocket = io(serverAddress!);
