import { RENDER_STATE } from "@xharmagne/react-map-gl-draw";
import variables from "styling/variables.module.scss";

const circleRadius = 8;
export const defaultFeatureStyle = {
  stroke: variables.EliPodiumDarkTeal,
  strokeWidth: 4,
  fill: variables.EliPodiumDarkTeal,
  fillOpacity: 0.7
};

export const defaultEditHandleStyle = {
  stroke: variables.EliPodiumDarkTeal,
  strokeWidth: 4,
  fill: variables.EliPodiumDarkTeal,
  fillOpacity: 1,
  r: circleRadius,
  cursor: "crosshair"
};

export const featureStyle = ({ state }) => {
  switch (state) {
    case RENDER_STATE.SELECTED:
      return defaultFeatureStyle;
    case RENDER_STATE.HOVERED:
      return {
        ...defaultFeatureStyle,
        fillOpacity: 0.5
      };
    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      return {
        ...defaultFeatureStyle,
        fillOpacity: 0.2
      };
    default:
      return {
        ...defaultFeatureStyle,
        strokeWidth: 0,
        fillOpacity: 0.4
      };
  }
};

export const editHandleStyle = ({ state }) => {
  switch (state) {
    case RENDER_STATE.SELECTED:
    case RENDER_STATE.HOVERED:
      return {
        ...defaultEditHandleStyle,
        fill: "#97c0c4",
        r: 10
      };
    default:
      return {
        ...defaultEditHandleStyle,
        fill: variables.White
      };
  }
};

export const tooltipStyle = {
  text: {
    fill: "white",
    textAnchor: "middle",
    pointerEvents: "none"
  },
  rect: {
    fill: variables.EliPodiumDarkTeal,
    rx: 16,
    pointerEvents: "none"
  }
};
