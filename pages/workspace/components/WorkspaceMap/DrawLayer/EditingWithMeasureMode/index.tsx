import { FeatureOf, Polygon, _memoize as memoize } from "@nebula.gl/edit-modes";
import type { Feature, FeatureCollection, Tooltip } from "@nebula.gl/edit-modes";
import turfArea from "@turf/area";
import turfBearing from "@turf/bearing";
import turfCentroid from "@turf/centroid";
import turfDestination from "@turf/destination";
import { Feature as TurfFeature } from "@turf/helpers";
import turfMidpoint from "@turf/midpoint";
import { EditingMode, ModeProps } from "@xharmagne/react-map-gl-draw";
import { FormattingEnum } from "utils/constants";
import { formatDataForDisplay } from "utils/units";
import { calculateDistanceForTooltip, getAreaUnit, getLengthUnit } from "../utils";

export class EditingWithMeasureMode extends EditingMode {
  _getSelectedFeature(data, selectedIndexes) {
    const features = data && data.features;
    const selectedIndex = selectedIndexes && selectedIndexes[0];
    return features && features[selectedIndex];
  }

  _getAreaTooltip(feature: Feature, modeConfig): Tooltip | null {
    const areaUnit = getAreaUnit(modeConfig);
    const turfFeature = feature as TurfFeature;
    const centroid = turfCentroid(turfFeature);

    let area = turfArea(turfFeature); // turfArea returns area in sqm

    const shouldConvertToSqFt = areaUnit === FormattingEnum.SquareFeet;
    if (shouldConvertToSqFt) {
      area *= 10.76391041671;
    }

    if (centroid?.geometry) {
      const text = formatDataForDisplay(areaUnit, area, 0);
      return {
        position: centroid.geometry.coordinates as [number, number, number],
        text
      };
    }

    return null;
  }

  _getLengthTooltips(feature: FeatureOf<Polygon>, modeConfig): Tooltip[] {
    const tooltips: Tooltip[] = [];

    const lengthUnit = getLengthUnit(modeConfig);
    const centroid = turfCentroid(feature as TurfFeature);
    const coordinates = feature.geometry.coordinates;

    for (let j = 0; j < coordinates[0].length - 1; j++) {
      const positionA = coordinates[0][j];
      const positionB = coordinates[0][j + 1];
      const distance = calculateDistanceForTooltip(positionA, positionB, modeConfig);

      if (distance >= 10) {
        const midpoint = turfMidpoint(positionA, positionB)?.geometry?.coordinates;

        if (midpoint) {
          const bearing = turfBearing(centroid, midpoint);
          const destination = turfDestination(midpoint, 0.04, bearing);
          const destinationCoords = destination.geometry?.coordinates;
          if (destinationCoords) {
            tooltips.push({
              position: [destinationCoords[0], destinationCoords[1]],
              text: formatDataForDisplay(lengthUnit, distance, 0)
            });
          }
        }
      }
    }

    return tooltips;
  }

  _getTooltips = memoize(({ modeConfig, data, selectedIndexes }) => {
    const tooltips: Tooltip[] = [];

    const feature = this._getSelectedFeature(data, selectedIndexes) as Feature;
    if (feature?.geometry?.type === "Polygon") {
      const areaTooltip = this._getAreaTooltip(feature, modeConfig);
      if (areaTooltip) {
        tooltips.push(areaTooltip);
      }

      const lengthTooltips = this._getLengthTooltips(feature as FeatureOf<Polygon>, modeConfig);
      tooltips.push(...lengthTooltips);
    }

    return tooltips;
  });

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const { modeConfig, data, selectedIndexes } = props;
    return this._getTooltips({ modeConfig, data, selectedIndexes });
  }
}
