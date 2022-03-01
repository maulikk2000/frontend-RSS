import { useNonActiveProjects, useProjectStore } from "stores/projectStore";
import { Source, Layer } from "react-map-gl";
import { createGeoJSONFromCoordinates } from "pages/workspace/utils/mapUtils";
import { FC, useEffect } from "react";
import { MapPopup } from "../MapPopup/MapPopup";
import variables from "styling/variables.module.scss";
import { useMapStore } from "stores/mapStore";
import { MapLayerIds } from "types/map";

type Props = {
  layerId: string;
  workspaceId: string;
  selectedFeature?: {
    feature: mapboxgl.MapboxGeoJSONFeature;
    point: [number, number];
  };
  onDeselectFeature: () => void;
  projectListHoveredId: string | undefined;
};

export const ProjectLayers: FC<Props> = ({
  layerId,
  workspaceId,
  selectedFeature,
  onDeselectFeature,
  projectListHoveredId
}) => {
  const [projectStore, projectActions] = useProjectStore();
  const [mapStore] = useMapStore();
  const [getNonActiveProjects] = useNonActiveProjects();

  useEffect(() => {
    if (projectStore.projects.length === 0) {
      projectActions.getProjects(workspaceId);
    }
  }, [projectStore.projects.length, workspaceId, projectActions]);

  const showPopup = selectedFeature != null && selectedFeature.feature.properties?.layerId === layerId;

  const focusedProjectId = selectedFeature?.feature.source;
  const popupCoordinates = selectedFeature?.point;
  const projectLayer = mapStore.mapLayers?.[MapLayerIds.Projects];

  return (
    <>
      {projectLayer && (
        <>
          {showPopup && focusedProjectId && popupCoordinates && (
            <MapPopup
              onClose={onDeselectFeature}
              popupCoordinates={popupCoordinates}
              projectId={focusedProjectId}
              projectListHoveredId={projectListHoveredId}
            />
          )}

          {getNonActiveProjects?.map((project) => (
            <Source
              key={project.id}
              id={project.id}
              attribution={"project"}
              clusterProperties={{ type: "project" }}
              type="geojson"
              data={createGeoJSONFromCoordinates(project.coordinates!, layerId)}
            >
              <Layer
                beforeId={MapLayerIds.ThreeDBuildings}
                type="fill"
                paint={{
                  "fill-color": variables.ProjectLayerColor,
                  "fill-opacity":
                    focusedProjectId && focusedProjectId === project.id ? 0.7 : projectLayer.isOn ? 0.3 : 0
                }}
              />
              <Layer
                type="line"
                paint={{
                  "line-color": variables.ProjectLayerColor,
                  "line-width": projectLayer.isOn || (focusedProjectId && focusedProjectId === project.id) ? 2 : 0
                }}
              />
            </Source>
          ))}
        </>
      )}
    </>
  );
};
