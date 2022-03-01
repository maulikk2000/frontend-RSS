import classes from "./WorkspaceList.module.scss";
import { FC, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { getRoute } from "routes/utils";
import { RouteName } from "routes/types";
import { useAnalytics } from "utils/analytics";
import { useWorkspaceStore } from "stores/workspaceStore";

type WorkspaceListItemProps = {
  workspaceName: string;
};

const WorkspaceListItem: FC<WorkspaceListItemProps> = ({ workspaceName }) => {
  const history = useHistory();

  const { trackEvent } = useAnalytics();

  const goToWorkspace = useCallback(() => {
    trackEvent("workspace_view", { workspace_name: workspaceName });

    const workspaceRoute = getRoute(RouteName.Workspace);
    history.push(workspaceRoute.getNavPath!({ selectedWorkSpaceName: workspaceName }));
  }, [trackEvent, workspaceName, history]);

  return (
    <li className={classes.listItem} onClick={goToWorkspace}>
      <div className={classes.title}>{workspaceName}</div>
    </li>
  );
};

export const WorkspaceList: FC = () => {
  const [workspaceStore, workspaceActions] = useWorkspaceStore();
  const workspaceNames = workspaceStore.workspaces.map((workspace) => workspace.name);

  useEffect(() => {
    if (workspaceStore.workspaces.length === 0) {
      workspaceActions.getWorkspaces();
    }
  }, [workspaceActions, workspaceStore.workspaces.length]);

  return (
    <div className={classes.container}>
      <h1>Workspaces</h1>
      <p>This is a list of workspaces that you have access to. Select a workspace to start working on a project.</p>
      <div className={classes.content}>
        <ul className={classes.list}>
          {workspaceNames.map((name) => (
            <WorkspaceListItem workspaceName={name} key={name.replace(/\s/g, "")} />
          ))}
        </ul>
      </div>
    </div>
  );
};
