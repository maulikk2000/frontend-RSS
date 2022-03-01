import { SceneSelector } from "../Scenes/SceneSelector";
import { SkyContext } from "../Sky/SkyContext";
import { MapPlane } from "./MapPlane";
import { ZoneObject } from "./Zone/ZoneObject";
import { NeighbouringBuildings } from "./NeighbouringBuildings";
import { OrbitalControlsWrapper } from "./OrbitalControlWrapper/OrbitalControlWrapper";
import { useSelectedProject } from "stores/projectStore";
import { DimensionalCamera } from "./DimensionalCamera";
import { ComplianceLayers } from "./Compliance/ComplianceLayers";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { TestWindViewer } from "./TestWindViewer";
import { useControls } from "leva";
import { useThree } from "react-three-fiber";
import { NoToneMapping, LinearEncoding, VSMShadowMap } from "three";
import { MeasurementTool } from "../Tools/MeasurementTool/MeasurementTool";
import { SunlightViewer } from "./SunlightViewer";
import { useSimulationStore } from "stores/simulationStore";
import { STLUploader } from "../Simulation/STLUploader/STLUploader";
import { FloorplateLoader } from "../Floorplate/FloorplateLoader";

export const LoFiScene = () => {
  const [configSettings] = useConfiguratorSettingsStore();
  const [simulationStore] = useSimulationStore();
  const [selectedProject] = useSelectedProject();

  const configToolsMode = useConfiguratorToolsStore((state) => state.mode);

  const { gl } = useThree();

  gl.toneMapping = NoToneMapping;
  gl.outputEncoding = LinearEncoding;
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = VSMShadowMap;
  gl.domElement.style.cursor = "default";

  const { showFloorPlate } = useControls("Floor Plate", {
    showFloorPlate: false
  });

  const showSunAnalysis = simulationStore.selectedSimulationAnalysis?.type === "Solar";

  const showWindAnalysis = simulationStore.selectedSimulationAnalysis?.type === "Wind";

  let coordinates = selectedProject ? selectedProject.coordinates : null;
  if (!selectedProject || !coordinates || (coordinates && coordinates.length === 0)) {
    return null;
  }
  return (
    <>
      <DimensionalCamera />

      <OrbitalControlsWrapper />

      <ComplianceLayers />

      <MapPlane />

      {/* <EnvelopeObject /> */}
      {configToolsMode === "measure" && configSettings.is2D && <MeasurementTool />}

      <ZoneObject />

      <NeighbouringBuildings worldCoordinates={selectedProject!.siteWorldCoordinates} />

      <SkyContext />

      <SceneSelector />

      {showWindAnalysis && <TestWindViewer />}

      {showSunAnalysis && <SunlightViewer />}

      {showFloorPlate && <FloorplateLoader />}

      <STLUploader />
    </>
  );
};
