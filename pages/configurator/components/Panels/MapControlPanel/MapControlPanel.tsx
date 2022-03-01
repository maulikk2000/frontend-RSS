import LanguageIcon from "@material-ui/icons/Language";
import { CenterFocusStrong } from "@material-ui/icons";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";

import classes from "./MapControlPanel.module.scss";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useMeshReferenceStore } from "pages/configurator/stores/meshReferenceStore";
import { Compass } from "./Compass/Compass";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import { massingMapConfig as mapConfig } from "utils/mapConstants";

type Props = {
  editorPanelDocked: boolean;
};
export const MapControlPanel = ({ editorPanelDocked }: Props) => {
  const [mapSettings, mapSettingsActions] = useMapSettingsStore();
  const [meshRefs] = useMeshReferenceStore();
  const [configSettings, configSettingsActions] = useConfiguratorSettingsStore();
  const [, shadowDisplayActions] = useShadowDisplayStore();

  const setConfigToolsMode = useConfiguratorToolsStore((state) => state.setMode);

  // Zooms in and out for Orbital Control on Map Size Change
  const zoom = (value: number) => {
    if (meshRefs.orbitRef && meshRefs.orbitRef.current) {
      const scrollEvent = new WheelEvent("wheel", { deltaY: value });
      meshRefs.orbitRef.current.domElement.dispatchEvent(scrollEvent);
    }
  };

  const setCameraDimension = () => {
    setConfigToolsMode("none");
    shadowDisplayActions.setReceiveShadows(configSettings.is2D);
    configSettingsActions.set2D(!configSettings.is2D);
  };

  const getClasses = () => {
    let className = `${classes.map_control_panel} `;
    if (editorPanelDocked) {
      className += `${classes.editorDocked} `;
    }
    return className;
  };

  return (
    <>
      <div
        className={getClasses()}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div
          className={classes.navigation}
          data-title={"Zoom In"}
          onClick={() => {
            zoom(-100);
          }}
        >
          +
        </div>

        <div
          className={classes.navigation}
          data-title={"Zoom Out"}
          onClick={() => {
            zoom(100);
          }}
        >
          <span className={classes.minus} />
        </div>

        <div
          className={classes.navigation}
          data-title={mapSettings.style === mapConfig.styles.basic ? "Satellite Map" : "Street Map"}
          onClick={(e) => {
            mapSettingsActions.setStyle(
              mapSettings.style === mapConfig.styles.satellite ? mapConfig.styles.basic : mapConfig.styles.satellite
            );
          }}
        >
          <LanguageIcon />
        </div>
        <Compass />
        <div className={classes.navigation + " " + classes.text} data-title={"2D View"} onClick={setCameraDimension}>
          {!configSettings.is2D ? "2D" : "3D"}
        </div>

        <div
          className={classes.navigation}
          data-title="Center"
          onClick={() => {
            mapSettingsActions.setReturnToCenter(mapSettings.returnToCenter + 1);
          }}
        >
          <CenterFocusStrong />
        </div>
      </div>
    </>
  );
};
