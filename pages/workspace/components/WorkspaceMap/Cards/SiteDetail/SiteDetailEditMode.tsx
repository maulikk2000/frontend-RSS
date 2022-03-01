import React, { FC, useEffect } from "react";
import { useMapStore } from "stores/mapStore";
import SiteDetailCard, { DetailCardToggleProps } from "./SiteDetailCard";
import { useActiveProject, useProjectStore } from "stores/projectStore";
import { getRoute } from "routes/utils";
import { RouteName } from "routes/types";
import { useHistory } from "react-router";
import { useWorkspaceStore } from "stores/workspaceStore";
import { SiteDetailProps } from "pages/workspace/components/WorkspaceMap/Cards/SiteDetail/SiteDetail";

export const SiteDetailEditMode: FC<SiteDetailProps & DetailCardToggleProps> = ({ selectedSite, show }) => {
  const [{ drawLayerStatus }, { setShowSiteDetailModal, setDrawLayerStatus }] = useMapStore();
  const [{ activeProjectAction }, { updateProjectCoordinates }] = useProjectStore();
  const [{ selectedWorkSpace }] = useWorkspaceStore();
  const history = useHistory();
  const [activeProject] = useActiveProject();

  const updateProjectSite = async () => {
    setShowSiteDetailModal(false);
    // @ts-ignore
    const coordinates = selectedSite?.geometry?.coordinates?.[0];
    if (coordinates) {
      await updateProjectCoordinates(coordinates);
      setDrawLayerStatus("saved");
    }
  };

  useEffect(() => {
    setDrawLayerStatus("unsaved");
  }, []);

  useEffect(() => {
    if (drawLayerStatus === "saved") {
      history.push(
        getRoute(RouteName.Workspace).getNavPath!({
          selectedWorkSpaceName: selectedWorkSpace
        })
      );
    }
  }, [drawLayerStatus, history, selectedWorkSpace]);

  const props = {
    title: "Edit Site",
    description: `Click Done once you have finished editing your site for Project ${activeProject?.name}`,
    onClick: updateProjectSite,
    btnText: "Done",
    analyticsId: "UpdateProjectFromExploreMap",
    disabled: false,
    show: show
  };

  if (activeProjectAction === "DELETE") {
    props.description = `Start drawing a polygon to update Project ${activeProject?.name}`;
    props.disabled = true;
  } else if (activeProjectAction === undefined) {
    props.description = `Draw or select a polygon to update Project ${activeProject?.name}`;
    props.disabled = true;
  }

  return <SiteDetailCard {...props} />;
};

export default SiteDetailEditMode;
