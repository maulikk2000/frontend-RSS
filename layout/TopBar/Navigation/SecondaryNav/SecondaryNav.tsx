import { FC, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getRoute, getRouteByPath } from "routes/utils";
import classes from "./SecondaryNav.module.scss";
import { RouteProps, RouteArgs, RouteName } from "../../../../routes/types";
import { useWorkspaceStore } from "stores/workspaceStore";
import { useAnalytics } from "utils/analytics";
import { useProjectStore } from "stores/projectStore";
import { useScenarioStore } from "stores/scenarioStore";

export const SecondaryNavForLocation = () => {
  const [workspaceStore] = useWorkspaceStore();
  const [projectStore] = useProjectStore();
  const [scenarioStore] = useScenarioStore();
  const [navItems, setNavItems] = useState<RouteProps[]>([]);
  const location = useLocation();

  useEffect(() => {
    const currentRoute: RouteProps | null = getRouteByPath(location.pathname);

    if (currentRoute && currentRoute?.secondaryRoutes) {
      setNavItems(currentRoute?.secondaryRoutes.map((ss) => getRoute(ss)));
    }
  }, [location]);

  return (
    <SecondaryNav
      navItems={navItems}
      currentRouteArgs={{
        selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
        selectedProjectId: projectStore.selectedProjectId,
        selectedScenarioIds: scenarioStore.selectedScenarioIds.join(","),
        selectedScenarioId:
          scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : undefined
      }}
    />
  );
};

type Props = {
  currentRouteArgs: RouteArgs;
  navItems: NavItem[];
};

type NavItem = {
  name: RouteName;
  displayName?: string;
  secondaryDisplayName?: string;
  getNavPath?: (args: RouteArgs) => string;
};

export const SecondaryNav: FC<Props> = ({ currentRouteArgs, navItems }) => {
  const { trackEvent } = useAnalytics();

  const handleNavItemClick = (itemName: string) => () => {
    trackEvent("secondary_nav_click", {
      workspace_name: currentRouteArgs.selectedWorkSpaceName,
      item_name: itemName
    });
  };

  return (
    <div className={classes.navWrapper}>
      {navItems.map((navItem) => {
        return (
          <NavLink
            key={navItem.name}
            className={classes.linkButton}
            to={navItem.getNavPath!(currentRouteArgs)}
            activeClassName={classes.active}
            exact
            onClick={handleNavItemClick(navItem.secondaryDisplayName!)}
          >
            {navItem.secondaryDisplayName}
          </NavLink>
        );
      })}
    </div>
  );
};
