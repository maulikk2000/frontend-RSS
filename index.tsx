import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./styling/_variables.scss";
import App, { AppRefObject } from "./App";
import { Auth0Provider } from "./stores/auth0";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { initializeAnalytics } from "./utils/analytics";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { financialGraphQlUrl } from "pages/financial/constants";

//initialize Apollo client -- financial
const financialClient = new ApolloClient({
  uri: process.env.REACT_APP_BASE_API + financialGraphQlUrl,
  cache: new InMemoryCache()
});

const IndexComponent = () => {
  const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN ?? "";
  const auth0ClientId = window["Cypress"]
    ? process.env.REACT_APP_CYPRESS_AUTH0_CLIENTID ?? ""
    : process.env.REACT_APP_AUTH0_CLIENTID ?? "";
  const auth0RedirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;
  const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  const appChildRef = useRef<AppRefObject>(null);

  useEffect(() => {
    if (auth0Domain === undefined || auth0ClientId === undefined) {
      throw new Error("missing env vars");
    }
  }, [auth0ClientId, auth0Domain]);

  const onRedirectCallback = (targetUrl: string) => {
    if (appChildRef.current) {
      appChildRef.current?.redirectToPath(targetUrl);
    }
  };

  return (
    <Auth0Provider
      domain={auth0Domain}
      client_id={auth0ClientId}
      redirect_uri={auth0RedirectUri}
      audience={auth0Audience}
      onRedirectCallback={onRedirectCallback}
    >
      <ApolloProvider client={financialClient}>
        <Router>
          <Route>
            <App ref={appChildRef} />
          </Route>
        </Router>
      </ApolloProvider>
    </Auth0Provider>
  );
};

(async () => {
  await initializeAnalytics();
  ReactDOM.render(<IndexComponent />, document.getElementById("root"));
})();
