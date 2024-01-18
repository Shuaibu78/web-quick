import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from "@apollo/client";
import { getItemAsObject } from "../utils/localStorage.utils";
import { setContext } from "@apollo/client/link/context";
import { getApiUrl } from "../services/CustomHttp";
import { isDesktop } from "../utils/helper.utils";

export const location = globalThis.location;

export const httpLink = createHttpLink({
  uri: getApiUrl("graphql"),
});

const authLink = setContext((_, { headers }) => {
  const sessionsRedux = getItemAsObject("persist:SessionsliceReducer");
  const sessionData = sessionsRedux.session || "{}";
  const persedSession = JSON.parse(sessionData);

  const sessions = getItemAsObject("session");
  const token = sessions.token || persedSession.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "Bearer ",
    },
  };
});

const self = globalThis as any;

export const client = new ApolloClient<NormalizedCacheObject>({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache().restore(self.__APOLLO_STATE__ || {}),
});
