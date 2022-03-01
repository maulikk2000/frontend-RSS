import { Fade, Tooltip, withStyles } from "@material-ui/core";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import React, { FC, useCallback, useEffect } from "react";
import { ReactComponent as SaveIconImage } from "styling/assets/icons/save_nav_icon.svg";
import classes from "./SaveIcon.module.scss";

const timeout = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const DarkTooltip = withStyles((theme) => ({
  arrow: {
    color: "#1C252C"
  },
  tooltip: {
    backgroundColor: "#1C252C",
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    fontWeight: 400,
    padding: 16
  }
}))(Tooltip);

export const SaveIcon: FC = () => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();
  const saveConfiguration = useCallback(() => {
    buildingServiceActions.createConfiguration();
  }, [buildingServiceActions]);

  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

  useEffect(() => {
    const openThenCloseTooltip = async (): Promise<void> => {
      await timeout(2000);
      setIsTooltipOpen(true);
      await timeout(10000);
      setIsTooltipOpen(false);
    };
    openThenCloseTooltip();

    // Show and hide tooltip every 2 mins
    const tooltipInterval = setInterval(openThenCloseTooltip, 132000);
    return (): void => {
      clearInterval(tooltipInterval);
    };
  }, []);

  return (
    <div className={classes.saveIcon}>
      <DarkTooltip
        open={isTooltipOpen}
        title="Please save your progress prior to exiting"
        placement="left"
        arrow
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <button onClick={saveConfiguration}>
          <SaveIconImage className={classes.icon} />
          <p>Save Changes</p>
        </button>
      </DarkTooltip>
    </div>
  );
};
