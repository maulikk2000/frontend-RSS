import React, { useEffect } from "react";
import { RouteName } from "routes/types";
import { matchPath, Route, Switch, useLocation, useParams } from "react-router-dom";
import { useProjectStore, useSelectedProject } from "stores/projectStore";
import { useScenarioStore, useSelectedScenarios } from "stores/scenarioStore";
import { getRoute, getRoutePath } from "routes/utils";
import { useWorkspaceStore } from "stores/workspaceStore";
import BreadCrumbs, { Crumb } from "styling/components/BreadCrumbs";
interface params {
  workspaceName: string;
  projectId: string;
  scenarioId: string;
  scenarioIds: string;
}

const BreadCrumb: React.FC = () => {
  const location = useLocation();
  const [workspaceStore, workspaceActions] = useWorkspaceStore();
  const [projectStore, projectStoreActions] = useProjectStore();
  const [scenarioStore, scenarioStoreActions] = useScenarioStore();
  const { workspaceName, projectId, scenarioId, scenarioIds } = useParams<params>();
  const [selectedProject] = useSelectedProject();
  const [selectedScenarios] = useSelectedScenarios();

  const workSpaceRoute = getRoute(RouteName.Workspace);
  const projectRoute = getRoute(RouteName.Project);
  const scenarioRoute = getRoute(RouteName.Scenario);
  const scenarioComparisonRoute = getRoute(RouteName.ScenarioComparison);
  const financialRoute = getRoute(RouteName.Financial);

  const matchWorkSpaceRoute = matchPath(location.pathname, workSpaceRoute);
  const matchProjectRoute = matchPath(location.pathname, projectRoute);
  const matchScenarioRoute = matchPath(location.pathname, scenarioRoute);
  const matchScenarioComparisonRoute = matchPath(location.pathname, scenarioComparisonRoute);
  const matchFinancialRoute = matchPath(location.pathname, financialRoute);

  useEffect(() => {
    if (workspaceName && workspaceStore.selectedWorkSpace !== workspaceName) {
      workspaceActions.setSelectedWorkspace(workspaceName);
    }
  }, [workspaceName, workspaceActions, workspaceStore.selectedWorkSpace]);

  useEffect(() => {
    const setSelectedProject = async () => {
      if (projectId && projectStore.selectedProjectId !== projectId) {
        projectStoreActions.setSelectedProject(projectId);
      }
    };

    setSelectedProject();
  }, [projectId, projectStore.selectedProjectId, projectStoreActions]);

  useEffect(() => {
    const setSelectedScenario = async () => {
      if (
        scenarioId &&
        (scenarioStore.selectedScenarioIds.length !== 1 ||
          (scenarioStore.selectedScenarioIds.length === 1 && scenarioStore.selectedScenarioIds[0] !== scenarioId))
      ) {
        scenarioStoreActions.setSelectedScenario(scenarioId);
      }
    };

    setSelectedScenario();
  }, [scenarioId, scenarioStore.selectedScenarioIds, scenarioStoreActions]);

  useEffect(() => {
    const setScenarioComparison = async () => {
      if (scenarioIds) {
        const scenarioIdArray = [...new Set(scenarioIds.split(",").map((id) => id.trim()))];
        if (
          scenarioIdArray.length !== scenarioStore.selectedScenarioIds.length ||
          scenarioIdArray.sort().join(",") !== scenarioStore.selectedScenarioIds.sort().join(",")
        ) {
          scenarioStoreActions.setSelectedScenarios(scenarioIdArray);
        }
      }
    };

    setScenarioComparison();
  }, [scenarioIds, scenarioStore.selectedScenarioIds, scenarioStoreActions]);

  const BreadCrumbDisplay = () => {
    let crumbs: Crumb[] = [];
    if (workspaceStore?.selectedWorkSpace) {
      crumbs.push({
        label: "Workspace",
        value: workspaceStore.selectedWorkSpace,
        path: !matchWorkSpaceRoute
          ? workSpaceRoute.getNavPath!({
              selectedWorkSpaceName: workspaceStore.selectedWorkSpace
            })
          : undefined,
        id: workspaceStore.selectedWorkspaceId
      });
    }

    if (
      selectedProject &&
      (matchProjectRoute || matchScenarioRoute || matchScenarioComparisonRoute || matchFinancialRoute)
    ) {
      crumbs.push({
        label: "Project",
        value: selectedProject.name,
        path: !(matchProjectRoute && !matchScenarioRoute && !matchScenarioComparisonRoute)
          ? projectRoute.getNavPath!({
              selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
              selectedProjectId: projectStore.selectedProjectId
            })
          : undefined,
        id: projectStore.selectedProjectId
      });
    }

    if (selectedScenarios.length === 1 && (matchScenarioRoute || matchFinancialRoute)) {
      crumbs.push({
        label: "Scenario",
        value: selectedScenarios[0].name,
        id: selectedScenarios[0].id
      });
    }

    if (scenarioStore.selectedScenarioIds.length > 1 && matchScenarioComparisonRoute) {
      crumbs.push({
        label: "Scenario",
        value: "Comparison",
        id: "scenario-comparison"
      });
    }

    return <BreadCrumbs crumbs={crumbs} />;
  };

  return (
    <Switch>
      <Route
        path={[
          getRoutePath(RouteName.Workspace),
          getRoutePath(RouteName.Project),
          getRoutePath(RouteName.Explore),
          getRoutePath(RouteName.Scenario),
          getRoutePath(RouteName.ScenarioComparison),
          getRoutePath(RouteName.Financial)
        ]}
        exact
        component={BreadCrumbDisplay}
      />
    </Switch>
  );
};

export default BreadCrumb;
