import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { Routes } from "../routes";
import { LoadingScreen } from "./Common/LoadingScreen";

export const RouteComponent = () => {
  return process.env.REACT_APP_AUTH0_CLIENTID ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {Routes &&
          Routes.map((route) => (
            <PrivateRoute key={route.name} exact={route.exact} path={route.path} component={route.component} />
          ))}
      </Switch>
    </Suspense>
  ) : (
    // local without client id
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {Routes &&
          Routes.map((route) => (
            <Route key={route.name} exact={route.exact} path={route.path} component={route.component} />
          ))}
      </Switch>
    </Suspense>
  );
};
