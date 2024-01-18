import { isDesktop } from "../utils/helper.utils";

export function getCurrentHost() {
  const url = new URL(window.location.href);

  return `${url.protocol}//${url.host}`;
}

type IEndpoint = "json-rpc" | "graphql";

export const getApiUrl = (endpoint: IEndpoint) => {
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = getCurrentHost();

  const apiUri =
    !isDev && isDesktop()
      ? `${baseUrl}/${endpoint}`
      : `${process.env.REACT_APP_LOCAL_SERVER_API}/${endpoint}`;
  return apiUri;
};
