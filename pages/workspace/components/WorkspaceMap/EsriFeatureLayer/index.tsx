import { Source, Layer } from "react-map-gl";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { FC, useEffect, useState } from "react";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import { LngLatBounds } from "mapbox-gl";
import colors from "styling/variables.module.scss";
import { useWorkspaceStore, useSelectedWorkspace } from "stores/workspaceStore";
import { MapLayerIds } from "types/map";
import { useMapStore } from "stores/mapStore";
import { getToken } from "api/scenarioService/scenarioApi";

type Props = {
  bounds?: LngLatBounds;
};
export const EsriFeatureLayer: FC<Props> = ({ bounds }) => {
  const [workspaceStore, workspaceActions] = useWorkspaceStore();
  const [, mapActions] = useMapStore();
  const [selectedWorkspace] = useSelectedWorkspace();

  const [token, setToken] = useState<string | undefined>();
  useEffect(() => {
    const waitForToken = async () => {
      const { token } = await getToken();
      setToken(token);
    };
    waitForToken();
  }, []);

  useEffect(() => {
    workspaceActions.getWorkspace();
  }, [workspaceActions, workspaceStore.selectedWorkspaceId]);

  useEffect(() => {
    if (selectedWorkspace?.parcelSelectionMapLayer?.url) {
      mapActions.registerLayer({
        id: MapLayerIds.ParcelSelection,
        name: "Parcel Selection",
        isOn: false,
        group: "primary",
        order: 0
      });
    }
  }, [selectedWorkspace]);

  const [data, setData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined>({
    features: [],
    type: "FeatureCollection"
  });

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const nw = bounds.getNorthWest();
    const ne = bounds.getNorthEast();
    const se = bounds.getSouthEast();
    const sw = bounds.getSouthWest();

    const convertedGeo = geojsonToArcGIS({
      type: "Polygon",
      coordinates: [
        [
          [nw.lng, nw.lat],
          [ne.lng, ne.lat],
          [se.lng, se.lat],
          [sw.lng, sw.lat]
        ]
      ]
    });

    const options = {
      url:
        "https://lendlease.esriaustraliaonline.com.au/arcgis/sharing/servers/297ff574920d41dfa0f8d696c89713a8/rest/services/NSW_Cadastre_Map/FeatureServer/2",
      geometry: convertedGeo,
      geometryType: "esriGeometryPolygon" as const,
      spatialRel: "esriSpatialRelIntersects" as const,
      f: "geojson" as const,
      returnGeometry: true,
      outFields: [],
      params: {
        token
      }
    };

    queryFeatures(options).then((response) => {
      setData(response as any);
    });
  }, [selectedWorkspace, bounds]);

  if (!selectedWorkspace?.parcelSelectionMapLayer?.url || !mapActions.getMapLayer(MapLayerIds.ParcelSelection)?.isOn) {
    return null;
  }

  return (
    <>
      <Source key="test123" id="test123" type="geojson" data={data}>
        <Layer
          id={MapLayerIds.ParcelSelection}
          type="fill"
          paint={{
            "fill-color": colors.ParcelLayerColor,
            "fill-opacity": 0.2
          }}
        />
        <Layer
          type="line"
          paint={{
            "line-color": colors.ParcelLayerColor,
            "line-width": 2
          }}
        />
      </Source>
    </>
  );
};
