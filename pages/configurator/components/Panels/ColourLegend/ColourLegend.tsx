import { memo } from "react";
import classes from "./ColourLegend.module.scss";
import materialColors from "styling/materialColors.module.scss";
import { CONFIGURATOR_STATE } from "pages/configurator/data/enums";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getNameFromGDVUnitType, getOrderedGDVUnitTypes } from "pages/scenario/utils/apartmentUtils";
import Draggable from "react-draggable";

type ColourItemProps = {
  name: string;
  colour: string;
};
const ColourItem = ({ name, colour }: ColourItemProps) => {
  return (
    <div className={classes.colour_item}>
      <div style={colour ? { background: `${colour}` } : {}} className={classes.colour_circle} />
      <div className={classes.colour_text}>{name}</div>
    </div>
  );
};

export const ColourLegend = memo(() => {
  const [buildingService] = useV2BuildingServiceStore();

  if (buildingService.status !== CONFIGURATOR_STATE.SOLVED) {
    return null;
  }

  let unitTypes = [
    ...new Set(buildingService.building?.siteMetrics.unitMetrics.map((unitMetric) => unitMetric.unitType))
  ];

  unitTypes = getOrderedGDVUnitTypes(unitTypes);

  return (
    <Draggable bounds={"parent"}>
      <div className={classes.colourLegend}>
        <h2>Legend</h2>
        <div className={classes.colourLegendItems}>
          <div className={classes.colourLegendColumn}>
            {unitTypes.map(
              (unitType, index) =>
                materialColors[unitType] && (
                  <ColourItem key={index} name={getNameFromGDVUnitType(unitType)} colour={materialColors[unitType]} />
                )
            )}
          </div>
          <div className={classes.colourLegendColumn}>
            <ColourItem name={"Podium"} colour={materialColors.Podium} />
            <ColourItem name={"Core"} colour={materialColors.VerticalTransport} />
            <ColourItem name={"Site Parcel"} colour={materialColors.Zone} />
          </div>
        </div>
      </div>
    </Draggable>
  );
});
