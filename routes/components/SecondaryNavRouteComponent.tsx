import { SecondaryNavForLocation } from "layout/TopBar/Navigation/SecondaryNav/SecondaryNav";
import { Route, Switch } from "react-router-dom";
import { Routes } from "../routes";

export const SecondaryNavRouteComponent = () => {
  return (
    <Switch>
      {Routes &&
        Routes.map(
          (route, i) =>
            route.secondaryRoutes && <Route path={route.path} exact component={SecondaryNavForLocation} key={i} />
        )}
    </Switch>
  );
};
