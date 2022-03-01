import { createProjectFromGeoJSONFeature } from "pages/workspace/utils/mapUtils";
import { useProjectStore } from "stores/projectStore";
import { MP_Parcels } from "./MP_Orleans_Parcels";
import { NBS_Parcels } from "./NBS_Parcels";
import { Fragment } from "react";
import { useWorkspaceStore } from "stores/workspaceStore";
import { KC_Parcels } from "./KingsCentral_Parcel";

export const CreateGeoJSONProjects = () => {
  const [projectStore, projectStoreActions] = useProjectStore();
  const [workspaceStore] = useWorkspaceStore();

  const parcels = {
    "North Bayshore": NBS_Parcels,
    "Moffett Park": MP_Parcels,
    "Kings Central": KC_Parcels
  };

  const onAddDeleteProjects = async (type: "delete" | "add", workspaceName: string) => {
    const workspaceId = workspaceStore.workspaces.find((w) => w.name === workspaceName)!.id;

    const geoJSONProjects = parcels[workspaceName].features.map((parcel) => {
      return createProjectFromGeoJSONFeature(parcel, workspaceStore.selectedWorkSpace, workspaceName);
    });

    geoJSONProjects.forEach((project, index) => {
      if (!project) {
        return;
      }

      setTimeout(() => {
        if (type === "add") {
          projectStoreActions.createProject(workspaceId, project);
        } else if (type === "delete") {
          let duplicateProject = projectStore.projects.find(
            (duplicateProject) => duplicateProject.name === project.name
          );
          if (duplicateProject) {
            projectStoreActions.deleteProject(duplicateProject.id);
          }
        }
      }, 200 * index);
    });
  };

  const workspaceEntries = Object.entries(parcels).map(([workspaceName]) => {
    return (
      <Fragment key={workspaceName}>
        <button style={{ display: "none" }} onClick={() => onAddDeleteProjects("add", workspaceName)}>
          Create {workspaceName} Projects
        </button>
        <button style={{ display: "none" }} onClick={() => onAddDeleteProjects("delete", workspaceName)}>
          Delete {workspaceName} Projects
        </button>
      </Fragment>
    );
  });

  return <>{workspaceEntries}</>;
};
