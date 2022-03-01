import React from "react";

import classes from "./SunAnimation.module.scss";
import "../SunSimulationPicker.scss";
import PlayIcon from "@material-ui/icons/PlayCircleOutline";
import PauseIcon from "@material-ui/icons/PauseCircleOutline";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { SunSimulationDate } from "./SunSimulationDate";

type Props = {
  timeAnimationOpen: boolean;
};
export const SunAnimation = ({ timeAnimationOpen }: Props) => {
  const [configSettings, configSettingsActions] = useConfiguratorSettingsStore();

  return (
    <>
      {timeAnimationOpen && (
        <div className={classes.timeOfDay}>
          <div className={`${classes.toolModal} ${classes.animation}`}>
            <div
              className={classes.playPauseAnimation}
              onClick={() => configSettingsActions.setAnimateSun(!configSettings.animateSun)}
            >
              {configSettings.animateSun ? <PauseIcon /> : <PlayIcon />}
              {configSettings.animateSun ? "Pause" : "Play"}
            </div>
            <SunSimulationDate />
          </div>
        </div>
      )}
    </>
  );
};
