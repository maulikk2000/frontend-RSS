import React from "react";
import { Feature } from "geojson";
import { Layer, Source } from "react-map-gl";
import variables from "styling/variables.module.scss";

interface Props {
  combinedGeometry: Feature | undefined;
}

export const SelectedGeometryLayer: React.FC<Props> = ({ combinedGeometry }) => {
  return (
    <>
      {combinedGeometry && (
        <Source
          type="geojson"
          data={{
            features: [combinedGeometry],
            type: "FeatureCollection"
          }}
        >
          <Layer
            type="fill"
            paint={{
              "fill-color": variables.SelectedParcelFillColor,
              "fill-opacity": 0.5
            }}
          />
          <Layer
            type="line"
            paint={{
              "line-color": variables.SelectedParcelLineColor,
              "line-width": 2
            }}
          />
        </Source>
      )}
    </>
  );
};
