import { WorkspaceMap } from "pages/workspace/components/WorkspaceMap/WorkspaceMap";
import React from "react";
import { useMapStore } from "stores/mapStore";
import { useWorkspaceStore } from "stores/workspaceStore";
import LayerToggleControls from "styling/components/LayerToggleControls";
import SideBar from "styling/components/Sidebar";
import classes from "./WorkspaceMapPage.module.scss";

const WorkspaceMapPage: React.FC = () => {
  const [workspaceStore] = useWorkspaceStore();
  const [, mapActions] = useMapStore();
  const handleLayerToggle = (layerId: string) => {
    mapActions.toggleMapLayer(layerId);
  };

  return (
    <div className={classes.exploreWrapper}>
      <WorkspaceMap workspaceId={workspaceStore.selectedWorkspaceId} />
      <SideBar position="right" maxWidth={348}>
        <LayerToggleControls
          items={mapActions.getMapLayers()}
          handleLayerToggle={handleLayerToggle}
          title="Layer Options"
          subtitle="View rich contextual data by toggling data layers and visualise on the map in 2D or 3D."
        />{" "}
      </SideBar>
    </div>
  );
};

export default WorkspaceMapPage;
