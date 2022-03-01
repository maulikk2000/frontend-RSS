import classes from "./ProjectList.module.scss";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { useProjectStore } from "stores/projectStore";
import { Project } from "types/project";
import { useHistory } from "react-router";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import { useAnalytics } from "utils/analytics";
import { ApiCallState } from "types/common";
import { RouteName } from "routes/types";
import { getRoute, getRoutePath } from "routes/utils";
import { Button } from "styling/components";
import { ReactComponent as AddIcon } from "styling/assets/icons/plusIcon.svg";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";
import { removeFromLocalStorageArry } from "localStorage/util";
import { BackLink } from "pages/components/BackLink/BackLink";
import { CreateGeoJSONProjects } from "pages/workspace/components/CreateGeoJSONProjects/CreateGeoJSONProjects";
import { ProjectListItem } from "./ProjectListItem/ProjectListItem";
import { useMapStore } from "stores/mapStore";
import { DeleteProject } from "pages/workspace/components/WorkspaceMap/Cards/DeleteProject/DeleteProject";

type Props = {
  workspace: { id: string; name: string };
  setHoveredProjectId: Dispatch<SetStateAction<string | undefined>>;
};

export const ProjectList: FC<Props> = ({ workspace, setHoveredProjectId }) => {
  const [projectStore, projectStoreActions] = useProjectStore();
  const [mapStore, mapActions] = useMapStore();
  const history = useHistory();
  const [newprojects, setNewProjects] = useState<Array<string>>([]);
  const { trackEvent } = useAnalytics();
  const projectRoute = getRoute(RouteName.Project);
  const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
  const [activeListItem, setActiveListItem] = useState<string>("");

  useEffect(() => {
    projectStoreActions.getProjects(workspace.id);
  }, [projectStoreActions, workspace.id]);

  const handleClick = () => {
    const exploreMapRoute = getRoute(RouteName.Explore);
    if (exploreMapRoute && exploreMapRoute.getNavPath) {
      history.push(exploreMapRoute.getNavPath({ selectedWorkSpaceName: workspace.name }));
    }
  };
  useEffect(() => {
    const newprojects = localStorageService.getLocalStorageItem(LocalStorgeKey.new_projects);
    if (newprojects) setNewProjects(JSON.parse(newprojects));
  }, []);

  const goToProject = useCallback(
    (project: Project) => {
      trackEvent("project_view", {
        workspace_name: workspace.name,
        project_id: project.id,
        source: "list"
      });

      removeFromLocalStorageArry(LocalStorgeKey.new_projects, project.id);

      history.push(
        projectRoute.getNavPath!({
          selectedWorkSpaceName: workspace.name,
          selectedProjectId: project.id
        })
      );
    },
    [history, projectRoute.getNavPath, trackEvent, workspace.name]
  );

  useEffect(() => {
    if (projectToDelete) {
      mapActions.setShowDeleteProjectModal(true);
    }
  }, [projectToDelete, mapActions]);

  const handleConfirmDelete = (e, project: Project) => {
    if (project === projectToDelete) {
      mapActions.setShowDeleteProjectModal(true);
    } else {
      setProjectToDelete(project);
    }
    e.stopPropagation();
  };

  const updateActiveListItem = (projectId: string) => {
    setActiveListItem(projectId);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <BackLink to={getRoutePath(RouteName.Home)} text="Back to Workspaces" className={classes.backButton} />
        <h1>{workspace.name}</h1>
        <h4>Projects</h4>
        <CreateGeoJSONProjects />
      </div>
      <div className={classes.content}>
        {projectStore.getListState === ApiCallState.Loading ? (
          <div className={classes.loading}>
            <LoadingSpinner />
          </div>
        ) : (
          <ul className={classes.list}>
            {projectStore.projects.map((project) => {
              return (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  setHoveredProjectId={setHoveredProjectId}
                  isNew={newprojects.includes(project.id)}
                  onClick={goToProject}
                  onDelete={(e) => handleConfirmDelete(e, project)}
                  activeListItem={activeListItem}
                  updateActiveListItem={updateActiveListItem}
                />
              );
            })}
          </ul>
        )}
      </div>
      <div className={classes.btnWrapper}>
        <Button classType="secondary" onClick={handleClick} analyticsId="AddProject">
          <AddIcon className={classes.addIcon} />
          Add Project
        </Button>
      </div>
      {projectToDelete && <DeleteProject isDisplayed={mapStore.showDeleteProjectModal} project={projectToDelete} />}
    </div>
  );
};
