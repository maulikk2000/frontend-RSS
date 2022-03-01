import React from "react";
import { Layer, Source } from "react-map-gl";
import { useMapStore } from "stores/mapStore";
import { MapLayerIds } from "types/map";

const SatelliteLayer: React.FC = () => {
  const [, mapActions] = useMapStore();
  const hideLayer = !mapActions.getMapLayer(MapLayerIds.Satellite)?.isOn;

  return (
    <Source type="raster" url="mapbox://mapbox.satellite">
      <Layer
        id="satellite"
        type="raster"
        beforeId={MapLayerIds.ThreeDBuildings}
        paint={{ "raster-opacity": hideLayer ? 0 : 1 }}
      />
    </Source>
  );
};

export default SatelliteLayer;
