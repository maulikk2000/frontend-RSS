import { coordinate } from "pages/configurator/data/types";
import { createHook, createSelector, createStore, createSubscriber, defaults, StoreActionApi } from "react-sweet-state";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "api/scenarioService/scenarioApi";
import { CreateProjectRequest, Project, ProjectAction, ProjectStoreState } from "types/project";
import { MessageState, messageStoreActions } from "types/extensions/messageExtension";
import { getCentroidFromCoordinates } from "pages/configurator/components/utils";
import { getComplianceData } from "api/planningService/planningApi";
import { getApiErrorMessage } from "utils/errorUtils";
import { ApiCallState } from "types/common";
import { LocalStorgeKey } from "localStorage/type";
import { addToLocalStorageArry, removeFromLocalStorageArry } from "localStorage/util";

defaults.devtools = true;
type StoreApi = StoreActionApi<ProjectStoreState>;
type Actions = typeof actions;

const projectStoreInitialState: ProjectStoreState = {
  projects: [],
  selectedProjectId: "",
  activeProjectId: "",
  activeProjectAction: undefined,
  getListState: ApiCallState.Idle,
  getSingleState: ApiCallState.Idle,
  createState: ApiCallState.Idle,
  updateState: ApiCallState.Idle,
  deleteState: ApiCallState.Idle
};

export const actions = {
  ...messageStoreActions,
  ...{
    getProjects: (workspaceId: string) => async ({ setState, getState, dispatch }: StoreApi) => {
      try {
        if (getState().getListState === ApiCallState.Loading) {
          return;
        }

        setState({ getListState: ApiCallState.Loading });

        let projects = await getProjects(workspaceId);

        projects.forEach((p) => {
          p.siteWorldCoordinates = dispatch(updateSiteWorldCoordinates(p.siteWorldCoordinates, p.coordinates ?? []));
          p.coordinates = dispatch(updateSiteCoordinates(p.coordinates));
        });
        setState({
          projects,
          getListState: ApiCallState.Idle
        });
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, "Error loading projects");
        setState({
          getListState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    getProject: (projectId: string) => async ({ setState, getState, dispatch }: StoreApi) => {
      try {
        if (getState().getSingleState === ApiCallState.Loading || !projectId) {
          return;
        }

        setState({
          getSingleState: ApiCallState.Loading
        });

        let project = await getProject(projectId);
        if (project === null) {
          setState({ getSingleState: ApiCallState.Idle });
          return;
        }
        project.siteWorldCoordinates = dispatch(
          updateSiteWorldCoordinates(project.siteWorldCoordinates, project.coordinates ?? [])
        );
        project.coordinates = dispatch(updateSiteCoordinates(project.coordinates));

        const projectsCopy = dispatch(replaceProjectInList(project));
        setState({
          projects: projectsCopy,
          getSingleState: ApiCallState.Idle
        });
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, "Error getting project");
        setState({
          message: { text: errorMessage, variant: "error" },
          getSingleState: ApiCallState.Error
        });
      }
    },

    createProject: (workspaceId: string, createProjectRequest: CreateProjectRequest) => async ({
      setState,
      getState,
      dispatch
    }: StoreApi) => {
      try {
        if (getState().createState === ApiCallState.Loading) {
          return;
        }

        setState({
          createState: ApiCallState.Loading
        });

        dispatch(addSiteWorldCoordinates(createProjectRequest));

        const newProject = await createProject(workspaceId, createProjectRequest);
        if (newProject === null) {
          setState({ createState: ApiCallState.Idle });
          return;
        }

        addToLocalStorageArry(LocalStorgeKey.new_projects, newProject.id);

        const projectsCopy = dispatch(replaceProjectInList(newProject));
        setState({
          selectedProjectId: newProject.id,
          projects: projectsCopy,
          createState: ApiCallState.Idle,
          message: {
            text: "A new project was created successfully.",
            variant: "success"
          }
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error creating project");
        setState({
          createState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    updateProject: (project: Project, projectAction?: ProjectAction) => async ({
      setState,
      getState,
      dispatch
    }: StoreApi) => {
      try {
        if (project.id == null) {
          setState({
            message: { text: "Invalid update parameters", variant: "error" }
          });
          return;
        }

        if (getState().updateState === ApiCallState.Loading) {
          return;
        }

        setState({
          updateState: ApiCallState.Loading
        });

        const updatedProject = await updateProject(project);
        if (updatedProject === null) {
          setState({ updateState: ApiCallState.Idle });
          return;
        }
        const projectsCopy = dispatch(replaceProjectInList(updatedProject, projectAction));
        setState({
          projects: projectsCopy,
          updateState: ApiCallState.Idle,
          message: {
            text: "Project was updated successfully.",
            variant: "success"
          }
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error updating project");
        setState({
          updateState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    updateProjectCoordinates: (coordinates: coordinate[]) => async ({ getState, dispatch }: StoreApi) => {
      const project = getProjectById(getState().projects, getState().activeProjectId);
      if (project) {
        project.coordinates = coordinates;
        return await dispatch(actions.updateProject(project, "PATCH"));
      }
      return null;
    },

    deleteProject: (projectId: string) => async ({ setState, getState }: StoreApi) => {
      try {
        if (getState().deleteState === ApiCallState.Loading) {
          return;
        }

        setState({
          deleteState: ApiCallState.Loading
        });

        await deleteProject(projectId);

        removeFromLocalStorageArry(LocalStorgeKey.new_projects, projectId);

        let projects = getState().projects.filter((project) => project.id !== projectId);

        setState({
          projects,
          deleteState: ApiCallState.Idle,
          message: {
            text: "Project was deleted successfully.",
            variant: "success"
          }
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error updating project");
        setState({
          deleteState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    getProjectComplianceData: (userGroupName: string) => async ({ setState, getState }: StoreApi) => {
      try {
        if (getState().compliancePlanningDataState === ApiCallState.Loading || !userGroupName) {
          return;
        }
        setState({
          compliancePlanningDataState: ApiCallState.Loading,
          selectedProjectPlanning: []
        });
        const complianceData = await getComplianceData(userGroupName);
        setState({
          selectedProjectPlanning: complianceData,
          compliancePlanningDataState: ApiCallState.Idle
        });
      } catch (err) {
        //TODO: change this when we have a soluton for planning implementation
        //Currently no data for any project but original EW project (404 == no data)
        if (err.response && err.response.status === 404) {
          setState({
            compliancePlanningDataState: ApiCallState.Error
          });
          return;
        }
        const errorMessage = getApiErrorMessage(err, "Error getting planning data");
        setState({
          compliancePlanningDataState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    setSelectedProject: (projectId: string) => async ({ setState, getState, dispatch }: StoreApi) => {
      const selectedProjectId = projectId ? projectId.trim() : "";
      if (selectedProjectId) {
        const project = getProjectById(getState().projects, projectId);
        if (!project) {
          await dispatch(actions.getProject(selectedProjectId));
        }
      }

      setState({
        selectedProjectId: projectId ? projectId.trim() : ""
      });
    },

    setActiveProject: (projectId: string) => ({ setState }: StoreApi) => {
      setState({
        activeProjectId: projectId ? projectId.trim() : ""
      });
    },

    clearSelectedProject: () => ({ setState }: StoreApi) => {
      setState({
        selectedProjectId: ""
      });
    },

    resetProjectStore: () => ({ setState }: StoreApi) => {
      setState({
        ...projectStoreInitialState
      });
    },

    clearActiveProject: () => ({ setState }: StoreApi) => {
      setState({
        activeProjectId: "",
        activeProjectAction: undefined
      });
    },

    setActiveProjectAction: (perform?: ProjectAction) => ({ setState }: StoreApi) => {
      setState({
        activeProjectAction: perform
      });
    }
  }
};

const addSiteWorldCoordinates = (createProjectRequest: CreateProjectRequest) => ({ setState }: StoreApi) => {
  let siteWorldCoordinates: number[] | null = getCentroidFromCoordinates(createProjectRequest.coordinates!);

  if (!siteWorldCoordinates) {
    if (createProjectRequest.coordinates) {
      createProjectRequest.siteWorldCoordinates = createProjectRequest.coordinates[0];
    } else {
      createProjectRequest.siteWorldCoordinates = [0, 0];
      const message: MessageState = {
        text: "Error creating site world coordinates",
        variant: "error"
      };
      setState({ message });
    }
  } else {
    createProjectRequest.siteWorldCoordinates = siteWorldCoordinates;
  }
};

const updateSiteWorldCoordinates = (siteWorldCoordinates: coordinate | null, coordinates: coordinate[]) => ({
  setState
}: StoreApi) => {
  if ((siteWorldCoordinates && siteWorldCoordinates.length === 0) || !siteWorldCoordinates) {
    return getCentroidFromCoordinates(coordinates)!;
  } else {
    return siteWorldCoordinates;
  }
};

const areCoordinatesEqual = (c1: coordinate, c2: coordinate): boolean => {
  return c1[0] === c2[0] || c1[1] === c2[1];
};

const updateSiteCoordinates = (coordinates: coordinate[] | undefined) => () => {
  if (!coordinates) {
    return [];
  }
  if (!areCoordinatesEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }

  return coordinates;
};

const replaceProjectInList = (newProject: Project, projectAction?: ProjectAction) => ({
  getState
}: StoreApi): Project[] => {
  let projectsCopy = [...getState().projects];
  let existingProjectIndex = projectsCopy.findIndex((p) => p.id === newProject.id);

  if (existingProjectIndex !== -1 && projectAction !== "PATCH") {
    //DELETE project
    projectsCopy.splice(existingProjectIndex, 1, newProject);
  } else if (existingProjectIndex !== -1 && projectAction === "PATCH") {
    projectsCopy[existingProjectIndex] = newProject;
  } else {
    projectsCopy.push(newProject);
  }
  return projectsCopy;
};

const getOrderedProjets = (projectStoreState: ProjectStoreState): Project[] => {
  return projectStoreState.projects.sort((a: Project, b: Project) => a.name.localeCompare(b.name));
};

const getProjectById = (projects: Project[], projectId: string) => projects.find((p) => p.id === projectId);

const getSelectedProject = createSelector<ProjectStoreState, void, Project | undefined, Project[], string>(
  [(state: ProjectStoreState) => state.projects, (state: ProjectStoreState) => state.selectedProjectId],
  getProjectById
);

const getActiveProject = createSelector<ProjectStoreState, void, Project | undefined, Project[], string>(
  [(state: ProjectStoreState) => state.projects, (state: ProjectStoreState) => state.activeProjectId],
  getProjectById
);

const getNonActiveProjects = createSelector<ProjectStoreState, void, Project[] | undefined, Project[], string>(
  [(state: ProjectStoreState) => state.projects, (state: ProjectStoreState) => state.activeProjectId],
  (projects, activeProjectId) => projects.filter((p) => p.id !== activeProjectId)
);

const projectStore = createStore<ProjectStoreState, Actions>({
  initialState: projectStoreInitialState,
  actions,
  name: "Project Store"
});

export const useProjectStore = createHook<ProjectStoreState, Actions>(projectStore);

export const ProjectsSubscriber = createSubscriber<ProjectStoreState, Actions>(projectStore);

export const useOrderedProjects = createHook<ProjectStoreState, Actions, Project[]>(projectStore, {
  selector: getOrderedProjets
});

export const useSelectedProject = createHook<ProjectStoreState, Actions, Project | undefined>(projectStore, {
  selector: getSelectedProject
});

export const useActiveProject = createHook<ProjectStoreState, Actions, Project | undefined>(projectStore, {
  selector: getActiveProject
});

export const useNonActiveProjects = createHook<ProjectStoreState, Actions, Project[] | undefined>(projectStore, {
  selector: getNonActiveProjects
});
