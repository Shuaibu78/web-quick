import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import * as serviceWorker from "./serviceWorker";
import { client } from "./apollo-client/client";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

const Router = process.env.NODE_ENV === "development" ? BrowserRouter : HashRouter;

const AppWithApollo = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <App />
          </Router>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

ReactDOM.render(<AppWithApollo />, document.getElementById("root"));

serviceWorker.unregister();
