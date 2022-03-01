import React, { useEffect } from "react";
import { Layer, Source } from "react-map-gl";
import { useWorkspaceStore } from "stores/workspaceStore";
import { useMapStore } from "stores/mapStore";
import { MapLayerIds } from "types/map";

// This layer expects that the workspace masterplan
// is a valid geojson FeatureCollection,
// with Polygon features to describe site boundaries
// and Point features to specify where the parcel name label should be displayed for each site.
// The Point feature expects a PARCEL_NAME property for site label.
const MasterplanLayers: React.FC = () => {
  const [workspaceStore, workspaceActions] = useWorkspaceStore();
  const [, mapActions] = useMapStore();
  const masterplans = workspaceActions.getActiveMasterplans();
  const hideLayer = !mapActions.getMapLayer(MapLayerIds.Masterplan)?.isOn;

  useEffect(() => {
    if (!masterplans) {
      workspaceActions.getMasterplans().then();
    } else {
      mapActions.registerLayer({
        id: MapLayerIds.Masterplan,
        name: `${workspaceStore.selectedWorkSpace} Masterplan`,
        isOn: false,
        group: "primary",
        order: 1
      });
    }
  }, [masterplans, workspaceActions, mapActions, workspaceStore.selectedWorkSpace]);

  return (
    <>
      {masterplans && (
        <Source key={"masterplan"} type="geojson" data={masterplans}>
          <Layer
            type="fill"
            paint={{
              "fill-color": "#FFAB91",
              "fill-opacity": hideLayer ? 0 : 0.5
            }}
          />
          <Layer
            type="symbol"
            filter={["==", ["geometry-type"], "Point"]}
            paint={{
              "text-color": "#7D5345",
              "text-opacity": hideLayer ? 0 : 1
            }}
            layout={{
              "symbol-placement": "point",
              "text-field": "{PARCEL_NAME}",
              "text-size": 14
            }}
          />
        </Source>
      )}
    </>
  );
};

export default MasterplanLayers;
