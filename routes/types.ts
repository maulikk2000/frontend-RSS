import * as React from "react";

export type RouteProps = {
  name: RouteName;
  displayName?: string;
  secondaryDisplayName?: string;
  tertiaryDisplayName?: string;

  path: string; // For Url matching
  exact: boolean;
  component?: React.FC;
  icon?: React.ReactNode; // Added icon to IRoute for purpose of UI Visualisation
  getNavPath?: (args: RouteArgs) => string; // Create a url path for navigation
  secondaryRoutes?: RouteName[];
};

export type RouteArgs = {
  selectedWorkSpaceName: string;
  selectedProjectId?: string;
  selectedScenarioId?: string;
  selectedScenarioIds?: string;
};

export enum RouteName {
  Home,
  Login,
  Logout,
  Lab,
  Unauthorized401,
  NoApplicationAccess403,
  PageNotFound404,
  Workspace,
  Explore,
  Project,
  Scenario,
  ScenarioComparison,
  Financial
}
