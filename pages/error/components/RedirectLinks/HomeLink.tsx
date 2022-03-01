import { NavLink } from "react-router-dom";
import { RouteName } from "routes/types";
import { getRoutePath } from "routes/utils";

export const HomeLink = () => {
  const homelink = getRoutePath(RouteName.Home);
  return <NavLink to={homelink}>Return to Homepage</NavLink>;
};
