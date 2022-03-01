import classes from "./BackToProjectLink.module.scss";
import { NavLink } from "react-router-dom";
import { useScenarioStore } from "stores/scenarioStore";
import { ReactComponent as GoBackIcon } from "styling/assets/icons/go_back_icon.svg";
import { useProjectStore } from "stores/projectStore";
import { getRoute } from "routes/utils";
import { RouteName } from "routes/types";
import { useWorkspaceStore } from "stores/workspaceStore";

export const BackToProjectLink = () => {
  const [workspaceStore] = useWorkspaceStore();
  const [projectStore] = useProjectStore();
  const [, scenarioActions] = useScenarioStore();
  const projectPageRoute = getRoute(RouteName.Project);

  const handleGoBack = () => {
    scenarioActions.clearSelectedScenarios();
  };

  return (
    <>
      <NavLink
        to={projectPageRoute.getNavPath!({
          selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
          selectedProjectId: projectStore.selectedProjectId
        })}
        onClick={handleGoBack}
        className={classes.backButton}
      >
        <GoBackIcon className={classes.icon} /> Back To Project
      </NavLink>
    </>
  );
};
