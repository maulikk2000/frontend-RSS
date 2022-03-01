import { lazy } from "react";
import { ReactComponent as EliLabLogo } from "../styling/assets/icons/lab_nav_icon.svg";
import classes from "./routes.module.scss";
import { RouteName, RouteProps, RouteArgs } from "./types";

export const Routes: Array<RouteProps> = [
  {
    exact: true,
    component: lazy(() => import("pages/financial/pages/FinancialPage")),
    name: RouteName.Financial,
    secondaryDisplayName: "Financial",
    path: "/financial/workspaces/:workspaceName/projects/:projectId/scenarios/:scenarioId/sensitivities",
    getNavPath: (args: RouteArgs) => {
      return `/financial/workspaces/${args.selectedWorkSpaceName}/projects/${args.selectedProjectId}/scenarios/${args.selectedScenarioId}/sensitivities`;
    },
    secondaryRoutes: [RouteName.Scenario, RouteName.Financial]
  },
  {
    exact: true,
    component: lazy(() => import("pages/workspace/pages/WorkspacePage/WorkspacePage")),
    name: RouteName.Workspace,
    displayName: "Workspace",
    secondaryDisplayName: "Projects",
    path: "/workspaces/:workspaceName",
    getNavPath: (args: RouteArgs) => {
      return `/workspaces/${args.selectedWorkSpaceName}`;
    },
    secondaryRoutes: [RouteName.Workspace, RouteName.Explore]
  },
  {
    exact: true,
    component: lazy(() => import("pages/workspace/pages/WorkspaceMapPage/WorkspaceMapPage")),
    name: RouteName.Explore,
    displayName: "Explore",
    secondaryDisplayName: "Explore Map",
    path: "/workspaces/:workspaceName/explore",
    getNavPath: (args: RouteArgs) => {
      return `/workspaces/${args.selectedWorkSpaceName}/explore`;
    },
    secondaryRoutes: [RouteName.Workspace, RouteName.Explore]
  },
  {
    exact: true,
    component: lazy(() => import("pages/scenario/pages/comparison/ComparisonPage")),
    name: RouteName.ScenarioComparison,
    path: "/workspaces/:workspaceName/projects/:projectId/scenarios/comparison/:scenarioIds",
    getNavPath: (args: RouteArgs) => {
      return `/workspaces/${args.selectedWorkSpaceName}/projects/${args.selectedProjectId}/scenarios/comparison/${args.selectedScenarioIds}`;
    }
  },
  {
    exact: true,
    component: lazy(() => import("pages/scenario/pages/scenario/ScenarioPage")),
    name: RouteName.Scenario,
    displayName: "Scenario",
    secondaryDisplayName: "Massing",
    path: "/workspaces/:workspaceName/projects/:projectId/scenarios/:scenarioId",
    getNavPath: (args: RouteArgs) => {
      return `/workspaces/${args.selectedWorkSpaceName}/projects/${args.selectedProjectId}/scenarios/${args.selectedScenarioId}`;
    },
    secondaryRoutes: [RouteName.Scenario]
  },
  {
    exact: false,
    component: lazy(() => import("pages/project/pages/project/ProjectPage")),
    name: RouteName.Project,
    path: "/workspaces/:workspaceName/projects/:projectId",
    getNavPath: (args: RouteArgs) => {
      return `/workspaces/${args.selectedWorkSpaceName}/projects/${args.selectedProjectId}`;
    }
  },

  {
    exact: true,
    component: lazy(() => import("../pages/login/LoginPage")),
    name: RouteName.Login,
    path: "/login"
  },
  {
    exact: true,
    component: lazy(() => import("../pages/logout/LogoutPage")),
    name: RouteName.Logout,
    path: "/logout",
    icon: "lock_open"
  },
  {
    exact: true,
    component: lazy(() => import("pages/elilab/EliLabPage")),
    name: RouteName.Lab,
    path: "/elilab",
    icon: <EliLabLogo className={classes.iconLarge} />
  },
  {
    exact: true,
    component: lazy(() => import("pages/error/components/Unauthorized401Page/Unauthorized401Page")),
    name: RouteName.Unauthorized401,
    path: "/unauthorized"
  },
  {
    exact: true,
    component: lazy(() => import("pages/error/components/NoApplicationAccessPage/NoApplicationAccessPage")),
    name: RouteName.NoApplicationAccess403,
    path: "/forbidden"
  },
  {
    exact: true,
    component: lazy(() => import("pages/workspace/pages/WorkspaceListPage/WorkspaceListPage")),
    name: RouteName.Home,
    path: "/"
  },
  {
    exact: false,
    component: lazy(() => import("pages/error/components/NotFound404Page/NotFound404Page")),
    name: RouteName.PageNotFound404,
    path: "*"
  }
];
