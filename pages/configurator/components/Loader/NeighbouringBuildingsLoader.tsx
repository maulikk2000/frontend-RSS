import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";

import classes from "./NeighbouringBuildingsLoader.module.scss";
import { LoaderIcons } from "./LoaderIcons";

export const NeighbouringBuildingsLoader = () => {
  const [mapSettings, mapSettingsActions] = useMapSettingsStore();

  const Toast = ({ children }) => {
    return (
      <div className={classes.toast}>
        <div className={classes.inner}>{children}</div>
      </div>
    );
  };

  if (mapSettings.loadedNeighbouringBuildings === null) {
    return (
      <Toast>
        <small>Loading Neighbouring Buildings</small>
        <LoaderIcons />
      </Toast>
    );
  } else if (mapSettings.loadedNeighbouringBuildings === false) {
    return (
      <Toast>
        <small>Error Loading Neighbouring Buildings</small>
        <div className={classes.error} onClick={() => mapSettingsActions.setLoadedNeighbouringBuildings(null)}>
          <b>Retry</b>
        </div>
        <div onClick={() => mapSettingsActions.setLoadedNeighbouringBuildings(undefined)} className={classes.close}>
          <small>x</small>
        </div>
      </Toast>
    );
  } else {
    return null;
  }
};
