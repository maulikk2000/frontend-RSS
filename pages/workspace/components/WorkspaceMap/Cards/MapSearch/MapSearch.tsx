import { FC, RefObject, useCallback } from "react";
/*** import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"; 
moved this to our own scss file as we need to change things directly 
here since we have no control over what html and classes are added
***/
import Geocoder from "react-map-gl-geocoder";
import InteractiveMap from "react-map-gl";
import "./MapSearch.scss";
import variables from "styling/variables.module.scss";

interface Props {
  mapRef?: ((instance: InteractiveMap | null) => void) | RefObject<InteractiveMap> | null | undefined;
  mapToken: string;
  onViewportChange: (nextViewport) => void;
  containerRef: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined;
}

const marker = {
  color: variables.EliPodiumDarkTeal
};

export const MapSearch: FC<Props> = ({ mapRef, mapToken, onViewportChange, containerRef }) => {
  const handleViewportChanged = useCallback(
    (next) => {
      onViewportChange({
        ...next,
        transitionDuration: 1500
      });
    },
    [onViewportChange]
  );

  return (
    <Geocoder
      id="explore-map"
      mapRef={mapRef}
      onViewportChange={handleViewportChanged}
      mapboxApiAccessToken={mapToken}
      position="top-left"
      placeholder="Search a location or address"
      marker={marker}
      containerRef={containerRef}
    />
  );
};
