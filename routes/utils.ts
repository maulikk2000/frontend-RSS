import { Routes } from "./routes";
import { RouteArgs, RouteName, RouteProps } from "./types";
import { matchPath } from "react-router";

export const getRoute = (routeName: RouteName): RouteProps => {
  return Routes.find((route) => route.name === routeName)!;
};

export const getRouteByPath = (path: string): RouteProps => {
  return Routes.find((route) => {
    return matchPath(path, {
      path: route.path,
      exact: true,
      strict: false
    });
  })!;
};

export const getRouteNavPath = (routeName: RouteName, args: RouteArgs): string => {
  const routeObj = Routes.find((route) => route.name === routeName);
  return routeObj && routeObj.getNavPath ? routeObj.getNavPath(args) : routeObj ? routeObj.path : "";
};

export const getRoutePath = (routeName: RouteName): string => {
  const routeObj = Routes.find((route) => route.name === routeName);
  return routeObj ? routeObj.path : "";
};
