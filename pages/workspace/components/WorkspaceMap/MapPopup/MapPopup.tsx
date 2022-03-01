import { Popup } from "react-map-gl";
import { coordinate } from "pages/configurator/data/types";
import { useEffect, useMemo, useState } from "react";
import { useProjectStore } from "stores/projectStore";
import { useHistory } from "react-router-dom";
import { getRoute } from "routes/utils";
import { RouteArgs, RouteName } from "routes/types";
import { useAnalytics } from "utils/analytics";
import { useWorkspaceStore } from "stores/workspaceStore";
import classes from "./MapPopup.module.scss";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";
import Tag from "styling/components/Tag/Tag";
import { removeFromLocalStorageArry } from "localStorage/util";

type Props = {
  popupCoordinates: coordinate;
  projectId: string;
  onClose: () => void;
  projectListHoveredId: string | undefined;
};
export const MapPopup = ({ popupCoordinates, projectId, onClose, projectListHoveredId }: Props) => {
  const [projectStore] = useProjectStore();
  const [workspaceStore] = useWorkspaceStore();
  const [newprojects, setNewProjects] = useState<Array<string>>([]);
  const { trackEvent } = useAnalytics();
  const history = useHistory();

  useEffect(() => {
    const newprojects = localStorageService.getLocalStorageItem(LocalStorgeKey.new_projects);
    if (newprojects) setNewProjects(JSON.parse(newprojects));
  }, []);

  const project = useMemo(() => projectStore.projects.find((project) => project.id === projectId), [
    projectId,
    projectStore.projects
  ]);

  const proArgs: RouteArgs = {
    selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
    selectedProjectId: projectId
  };

  const goToProject = () => {
    const projectRoute = getRoute(RouteName.Project);

    trackEvent("project_view", {
      workspace_name: workspaceStore.selectedWorkSpace,
      project_id: projectId,
      source: "map"
    });

    removeFromLocalStorageArry(LocalStorgeKey.new_projects, projectId);

    history.push(projectRoute.getNavPath!(proArgs));
  };

  if (!project || popupCoordinates.length !== 2) {
    return null;
  }

  return (
    <Popup
      className={`${classes.mapboxPopup} ${projectListHoveredId ? `${classes.isHovered}` : undefined}`}
      latitude={popupCoordinates[1]}
      longitude={popupCoordinates[0]}
      closeButton={false}
      onClose={onClose}
      closeOnClick={false}
      anchor="top"
      tipSize={10}
    >
      <div className={classes.popUpItem} onClick={goToProject}>
        <h3>{project?.name}</h3>
        {newprojects && newprojects.includes(project.id) && (
          <Tag appearance="pill" type="new" tag="New">
            New
          </Tag>
        )}
      </div>
    </Popup>
  );
};
