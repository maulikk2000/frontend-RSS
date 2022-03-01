import React, { useState, useEffect, useContext, useCallback } from "react";
import createAuth0Client, {
  Auth0ClientOptions,
  IdToken,
  LogoutOptions,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import { LocalStorage, LocalStorgeKey } from "localStorage/type";
import localStorageService from "localStorage/localStorageService";
import { RouteName } from "routes/types";
import { getRoutePath } from "routes/utils";
var jwt = require("jsonwebtoken");

export interface Auth0User extends Omit<IdToken, "__raw"> {}

interface IAuth0Context {
  isInitializing: boolean;
  isAuthenticated: boolean;
  getIsAuthenticatedAndUpdateTokens(): Promise<boolean>;
  hasUserGroups(): boolean;
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
  logout(o?: LogoutOptions): void;
  getUserGroup(): string;
  getUserGroups: () => string[];
}

interface Auth0ProviderOptions {
  children: React.ReactElement;
  onRedirectCallback(targetUrl: string): void;
}
export interface Auth0LoginState {
  targetUrl: string | null;
  isAuthenticated: boolean;
}

export const Auth0Context = React.createContext<IAuth0Context | null>(null);
export const useAuth0 = () => useContext(Auth0Context)!;

export const Auth0Provider = ({
  children,
  onRedirectCallback,
  domain,
  client_id,
  redirect_uri,
  audience
}: Auth0ProviderOptions & Auth0ClientOptions) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [auth0LoginState, setAuth0LoginState] = useState<Auth0LoginState>({
    isAuthenticated: false,
    targetUrl: null
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const claimNamespace = "http://schemas.microsoft.com/ws/2008/06/identity/claims/";

  useEffect(() => {
    // Initialise Auth0 Client
    const initAuth0 = async () => {
      const auth0ClientFromHook = await createAuth0Client({
        domain,
        client_id,
        redirect_uri,
        audience
      });
      setAuth0Client(auth0ClientFromHook);
    };

    initAuth0(); // Initialise Auth0. This happens once on page load/refresh.
  }, [domain, client_id, redirect_uri, audience]);

  const loginWithRedirect = useCallback((options?: RedirectLoginOptions) => auth0Client!.loginWithRedirect(options), [
    auth0Client
  ]);

  const refreshTokensInLocalStorage = useCallback(async () => {
    var itoken = localStorageService.getLocalStorageItem(LocalStorgeKey.id_token);
    itoken = isTokenExpired(itoken) ? null : itoken;

    if (!itoken) {
      // Token is expired or does not exist in local storage
      const userProfile = await auth0Client!.getUser();
      try {
        const token = await auth0Client!.getTokenSilently();
        const localStoragetokenObj: LocalStorage = {
          key: LocalStorgeKey.access_token,
          value: token
        };
        localStorageService.setLocalStorageItem(localStoragetokenObj);
      } catch (error) {
        console.log(error);
      }

      try {
        const idTokenObj = await auth0Client!.getIdTokenClaims();
        const idToken = idTokenObj.__raw;
        const idTokenStorageObj: LocalStorage = {
          key: LocalStorgeKey.id_token,
          value: idToken
        };
        localStorageService.setLocalStorageItem(idTokenStorageObj);

        const userName: LocalStorage = {
          key: LocalStorgeKey.user_name,
          value: idTokenObj!.name
        };
        localStorageService.setLocalStorageItem(userName);

        const userAuth0Id: LocalStorage = {
          key: LocalStorgeKey.auth0_user_id,
          value: idTokenObj["sub"]
        };
        localStorageService.setLocalStorageItem(userAuth0Id);
      } catch (error) {
        console.log(error);
      }

      if (userProfile) {
        const userObject: LocalStorage = {
          key: LocalStorgeKey.user_id,
          value: userProfile!.email
        };
        localStorageService.setLocalStorageItem(userObject);

        let groupsArray = [];
        const userAppMetadata = userProfile[claimNamespace + "app_metadata"];
        if (userAppMetadata && userAppMetadata.authorization && userAppMetadata.authorization.groups) {
          groupsArray = userAppMetadata.authorization.groups ?? [];
        }
        const userGroupsObject: LocalStorage = {
          key: LocalStorgeKey.user_groups,
          value: groupsArray
        };
        localStorageService.setLocalStorageItem(userGroupsObject);
      }
    }
  }, [auth0Client]);

  useEffect(() => {
    // Handle Auth0's login call back
    const handleAuth0LoginCallback = async () => {
      let targetUrl = null;
      if (window.location.search.includes("code=")) {
        // Callback url will be appended with "code=xxx&state=xxx"
        try {
          const { appState } = await auth0Client!.handleRedirectCallback();
          targetUrl = appState && appState.targetUrl ? appState.targetUrl : null;
        } catch (callbackError) {
          // login failed, retry
          await loginWithRedirect({
            appState: { targetUrl: window.location.href }
          });
        }
      }

      const isAuthenticated = await auth0Client!.isAuthenticated();
      if (isAuthenticated) {
        refreshTokensInLocalStorage();
      }
      setAuth0LoginState({
        isAuthenticated: isAuthenticated,
        targetUrl: targetUrl
      });
      setIsInitializing(false);
    };

    if (auth0Client) {
      handleAuth0LoginCallback(); // Try to handle Auth0's login callback. This happens once on page load/refresh.
    }
  }, [auth0Client, loginWithRedirect, refreshTokensInLocalStorage]);

  useEffect(() => {
    const rewriteUrlToTargetLocation = () => {
      let rewriteUrl = window.location.pathname;
      if (auth0LoginState.targetUrl) {
        rewriteUrl = auth0LoginState.targetUrl;
      }
      if (rewriteUrl === getRoutePath(RouteName.Login) || rewriteUrl === getRoutePath(RouteName.Home)) {
        rewriteUrl = getRoutePath(RouteName.Home);
      }
      if (rewriteUrl !== window.location.href) {
        onRedirectCallback(rewriteUrl);
      }
    };

    if (!isInitializing && auth0LoginState.isAuthenticated) {
      // On successful login, save tokens and rewrite URL path to home page's path or user's target Url
      rewriteUrlToTargetLocation();
    }
  }, [isInitializing, auth0LoginState, onRedirectCallback]);

  const isTokenExpired = (currentToken: string | null): boolean => {
    if (currentToken) {
      const decodedToken = jwt.decode(currentToken, { complete: true });
      const decodedTime = new Date(0).setUTCSeconds(decodedToken.payload.exp);
      const dateNow = new Date();
      return decodedTime < dateNow.getTime();
    }
    return true;
  };

  const getIsAuthenticatedAndUpdateTokens = async (): Promise<boolean> => {
    const isAuthenticated = auth0LoginState.isAuthenticated;

    if (isAuthenticated) {
      refreshTokensInLocalStorage();
    }

    return isAuthenticated;
  };

  const getUserGroups = (): string[] => {
    const userGroupsString = localStorageService.getLocalStorageItem(LocalStorgeKey.user_groups);
    return userGroupsString ? userGroupsString.trim().split(",") : [];
  };

  const hasUserGroups = (): boolean => {
    if (auth0LoginState.isAuthenticated) {
      const userGroups = getUserGroups();

      return userGroups.length > 0;
    }
    return false;
  };

  // Currently we only support one group per user.
  // In the future, we will support multiple user groups per user.
  // User will select a group for workspace upon login and the selected group will be kept in context/storeState.
  const getSingleUserGroup = (): string => {
    const userGroups = getUserGroups();
    return userGroups.length > 0 ? userGroups[0] : "";
  };

  const logout = () => {
    auth0Client!.logout({
      client_id
    });
  };

  return (
    <Auth0Context.Provider
      value={{
        isInitializing,
        isAuthenticated: auth0LoginState.isAuthenticated,
        getIsAuthenticatedAndUpdateTokens,
        hasUserGroups,
        loginWithRedirect,
        logout,
        getUserGroups,
        getUserGroup: getSingleUserGroup
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
