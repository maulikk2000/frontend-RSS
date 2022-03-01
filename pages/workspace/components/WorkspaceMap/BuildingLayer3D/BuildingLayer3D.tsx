import React, { FC } from "react";
import { Layer } from "react-map-gl";
import { useMapStore } from "stores/mapStore";
import { MapLayerIds } from "types/map";

export const BuildingLayer3D: FC = () => {
  const [mapStore] = useMapStore();
  const threeDBuildingLayer = mapStore.mapLayers?.[MapLayerIds.ThreeDBuildings];
  const buildingLayer = {
    id: MapLayerIds.ThreeDBuildings,
    type: "fill-extrusion",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    minzoom: 15
  };
  return (
    <>
      {threeDBuildingLayer.isOn && (
        <Layer
          {...buildingLayer}
          paint={{
            "fill-extrusion-color": "#c0cdd9",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }}
        />
      )}
    </>
  );
};
