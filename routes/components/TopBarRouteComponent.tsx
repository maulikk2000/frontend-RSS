import TopBar from "layout/TopBar/TopBar";
import { Route, Switch } from "react-router-dom";
import { RouteName } from "routes/types";
import { getRoutePath } from "routes/utils";
import { Routes } from "../routes";

export const TopBarRouteComponent = () => {
  return (
    <Switch>
      {/*Don't show top bar on the lab page*/}
      <Route path={getRoutePath(RouteName.Lab)}></Route>

      {Routes.map((route, i) => {
        return <Route key={i + route.name + "-topbar"} path={route.path} component={TopBar} exact={route.exact} />;
      })}
    </Switch>
  );
};
