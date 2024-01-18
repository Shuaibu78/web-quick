import * as socketIO from "socket.io-client";
import { getItemAsObject } from "../utils/localStorage.utils";

const clientSocketClass = (client: any = null) => {
  const sessions = getItemAsObject("persist:SessionsliceReducer");
  const sessionData = sessions.session || "{}";
  const unPersistSession = JSON.parse(sessionData);
  const token = unPersistSession.token;
  if (client) {
    client.disconnect();
  }

  client = socketIO.connect(process.env.REACT_APP_LOCAL_SERVER_API!, {
    query: {
      token: token,
    },
  });

  return client;
};

export const socketClient = clientSocketClass();
