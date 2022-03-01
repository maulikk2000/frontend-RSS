import NoApplicationAccessPage from "pages/error/components/NoApplicationAccessPage/NoApplicationAccessPage";
import { useEffect, useRef, useState } from "react";

import { Route } from "react-router-dom";
import { RouteName } from "routes/types";
import { getRoutePath } from "routes/utils";
import { useAuth0 } from "../../stores/auth0";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isInitializing, getIsAuthenticatedAndUpdateTokens, loginWithRedirect, hasUserGroups } = useAuth0();

  const logoutPath = getRoutePath(RouteName.Logout);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const _isMounted = useRef(true);

  useEffect(() => {
    const checkIfAuthenticated = async () => {
      const authed = await getIsAuthenticatedAndUpdateTokens();
      if (_isMounted.current) {
        setIsAuthenticated(authed);
      }
      if (authed) {
        return;
      }
      const fn = async () => {
        await loginWithRedirect({
          appState: { targetUrl: window.location.pathname }
        });
      };
      fn();
    };

    _isMounted.current = true;
    if (!isInitializing) {
      checkIfAuthenticated();
    }
    return () => {
      _isMounted.current = false;
    };
  }, [path, isInitializing, getIsAuthenticatedAndUpdateTokens, loginWithRedirect]);

  const render = (props) => {
    if (isAuthenticated && !isInitializing) {
      if (path !== logoutPath && !hasUserGroups()) {
        return <NoApplicationAccessPage />;
      }
      return <Component {...props} />;
    }
    return null;
  };

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
