import { io } from "socket.io-client";

const serverAddress = process.env.REACT_APP_LOCAL_GRAPHQL_API;

export const clientSocket = io(serverAddress!);
