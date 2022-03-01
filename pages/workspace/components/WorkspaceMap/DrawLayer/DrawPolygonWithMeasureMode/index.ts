import turfMidpoint from "@turf/midpoint";
import { DrawPolygonMode, ModeProps } from "@xharmagne/react-map-gl-draw";
import { ClickEvent, Pick, FeatureWithProps, Point, FeatureCollection, Polygon, Tooltip } from "@nebula.gl/edit-modes";
import { formatDataForDisplay } from "utils/units";
import { calculateDistanceForTooltip, getLengthUnit } from "../utils";

type EditHandleType = "existing" | "intermediate" | "snap-source" | "snap-target" | "scale" | "rotate";
type EditHandleFeature = FeatureWithProps<
  Point,
  {
    guideType: "editHandle";
    editHandleType: EditHandleType;
    featureIndex: number;
    positionIndexes?: number[];
    shape?: string;
  }
>;

function getPickedEditHandle(picks: Pick[] | null | undefined): EditHandleFeature | null | undefined {
  const handles = getPickedEditHandles(picks);
  return handles.length ? handles[0] : null;
}

function getPickedEditHandles(picks: Pick[] | null | undefined): EditHandleFeature[] {
  const handles =
    (picks &&
      picks
        .filter((pick) => pick.isGuide && pick.object.properties.guideType === "editHandle")
        .map((pick) => pick.object)) ||
    [];

  return handles;
}

// modeConfig
//  - measurement: Measurement
export class DrawPolygonWithMeasureMode extends DrawPolygonMode {
  _isDrawingSessionFinished = false;
  _currentTooltips: Tooltip[] = [];

  _formatTooltip(distance, modeConfig?): string {
    const lengthUnit = getLengthUnit(modeConfig);
    return formatDataForDisplay(lengthUnit, distance, 0);
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const { lastPointerMoveEvent, modeConfig } = props;
    const positions = this.getClickSequence();

    if (positions.length > 0 && lastPointerMoveEvent && !this._isDrawingSessionFinished) {
      const positionA = positions[positions.length - 1];
      const positionB = lastPointerMoveEvent.mapCoords;
      const distance = calculateDistanceForTooltip(positionA, positionB, props.modeConfig);

      if (distance >= 10) {
        const midpoint = turfMidpoint(positionA, positionB)?.geometry?.coordinates;
        if (midpoint) {
          return [
            ...this._currentTooltips,
            {
              position: [midpoint[0], midpoint[1]],
              text: this._formatTooltip(distance, modeConfig)
            }
          ];
        }
      }

      return this._currentTooltips;
    }

    return this._currentTooltips;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { modeConfig } = props;
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (this._isDrawingSessionFinished) {
      this._isDrawingSessionFinished = false;
    }

    let positionAdded = false;
    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
      positionAdded = true;
    }
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 2 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      (clickedEditHandle.properties.positionIndexes[0] === 0 ||
        clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1)
    ) {
      // They clicked the first or last point (or double-clicked), so complete the polygon
      this._isDrawingSessionFinished = true;
      // Remove the hovered position
      const polygonToAdd: Polygon = {
        type: "Polygon",
        coordinates: [[...clickSequence, clickSequence[0]]]
      };

      const positionA = clickSequence[0];
      const positionB = clickSequence[clickSequence.length - 1];
      const distance = calculateDistanceForTooltip(positionA, positionB, modeConfig);
      const midpoint = turfMidpoint(positionA, positionB)?.geometry?.coordinates;
      if (midpoint) {
        this._currentTooltips.push({
          position: [midpoint[0], midpoint[1]],
          text: this._formatTooltip(distance, modeConfig)
        });
      }

      this.resetClickSequence();

      const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
      if (editAction) {
        props.onEdit(editAction);
      }
    } else if (positionAdded) {
      if (clickSequence.length > 1) {
        const positionA = clickSequence[clickSequence.length - 2];
        const positionB = clickSequence[clickSequence.length - 1];
        const distance = calculateDistanceForTooltip(positionA, positionB, modeConfig);
        const midpoint = turfMidpoint(positionA, positionB)?.geometry?.coordinates;
        if (midpoint) {
          this._currentTooltips.push({
            position: [midpoint[0], midpoint[1]],
            text: this._formatTooltip(distance, modeConfig)
          });
        }
      }
      // new tentative point
      props.onEdit({
        // data is the same
        updatedData: props.data,
        editType: "addTentativePosition",
        editContext: {
          position: event.mapCoords
        }
      });
    }
  }
}
