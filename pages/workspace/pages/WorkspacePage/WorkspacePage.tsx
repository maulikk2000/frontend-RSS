import classes from "./WorkspacePage.module.scss";
import { ProjectList } from "./ProjectList/ProjectList";
import { useEffect, useState } from "react";
import { WorkspaceMap } from "../../components/WorkspaceMap/WorkspaceMap";
import { useProjectStore } from "stores/projectStore";
import { useScenarioStore } from "stores/scenarioStore";
import { useWorkspaceStore } from "stores/workspaceStore";
import { useMapStore } from "stores/mapStore";

const WorkspacePage = () => {
  const [hoveredProjectId, setHoveredProjectId] = useState<string>();
  const [workspaceStore] = useWorkspaceStore();
  const [, mapActions] = useMapStore();
  const [, projectActions] = useProjectStore();
  const [, scenarioActions] = useScenarioStore();

  useEffect(() => {
    projectActions.clearSelectedProject();
    scenarioActions.clearSelectedScenarios();
    mapActions.reset();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        <ProjectList
          workspace={{
            id: workspaceStore.selectedWorkspaceId,
            name: workspaceStore.selectedWorkSpace
          }}
          setHoveredProjectId={setHoveredProjectId}
        />
      </div>
      <div className={classes.mainPanel}>
        <WorkspaceMap workspaceId={workspaceStore.selectedWorkspaceId} hoveredProjectId={hoveredProjectId} isPreview />
      </div>
    </div>
  );
};

export default WorkspacePage;
