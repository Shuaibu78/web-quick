import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from "@apollo/client";
import { getItemAsObject } from "../utils/localStorage.utils";
import { setContext } from "@apollo/client/link/context";
import { address } from "../services/CustomHttp";
import { isDesktop } from "../utils/helper.utils";

export const location = globalThis.location;
export const isDev = [`localhost:${process.env.REACT_APP_LOCAL_PORT}`].includes(location?.host);

export const apiUri = isDev
  ? `${process.env.REACT_APP_LOCAL_GRAPHQL_API}/graphql`
  : `${address}/graphql`;

export const httpLink = createHttpLink({
  uri: isDesktop() ? apiUri : `${process.env.REACT_APP_LOCAL_GRAPHQL_API}/graphql`,
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
