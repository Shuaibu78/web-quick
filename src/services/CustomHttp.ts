import { isDesktop } from "../utils/helper.utils";

export function getCurrentHost() {
  const url = new URL(window.location.href);

  // TODO: avoid hard coding the port number
  if (!url.port || url.port === "3000") {
    url.port = process.env.REACT_APP_SERVER_PORT || "";
  }

  return url.host;
}

export const address = `http://${getCurrentHost()}`;
