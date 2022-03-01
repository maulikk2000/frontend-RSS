import { FeatureCollection } from "geojson";

export type CompliancePlanning = {
  name: string;
  colour: string;
  type: string;
  height: number;
  geoJson: FeatureCollection;
};
