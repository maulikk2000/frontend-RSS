import React, { useEffect } from "react";
import { useMapStore } from "stores/mapStore";
import { useActiveProject, useProjectStore } from "stores/projectStore";
import { Feature } from "geojson";
import SiteDetailNewMode from "./SiteDetailNewMode";
import SiteDetailEditMode from "./SiteDetailEditMode";

export interface SiteDetailProps {
  selectedSite?: Feature;
}

export const SiteDetail: React.FC<SiteDetailProps> = ({ selectedSite }) => {
  const [mapStore] = useMapStore();
  const [activeProject] = useActiveProject();
  const [, { setActiveProject, setActiveProjectAction }] = useProjectStore();

  useEffect(() => {
    // cleanup project store's references for active project on unmount
    return () => {
      setActiveProject("");
      setActiveProjectAction(undefined);
    };
  }, []);

  return (
    <>
      {!activeProject ? (
        <SiteDetailNewMode show={mapStore.showSiteDetailModal} />
      ) : (
        <SiteDetailEditMode selectedSite={selectedSite} show={!selectedSite || mapStore.showSiteDetailModal} />
      )}
    </>
  );
};
