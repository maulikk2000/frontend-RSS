import { useEffect } from "react";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { CONFIGURATOR_STATE } from "pages/configurator/data/enums";
import { SolvedBuildingScene } from "./Building/SolvedBuildingScene";
import { PlotLabels } from "../Common/PlotLabels";
import { ConfiguratorScene } from "./Configurator/ConfiguratorScene";
import { useSelectedScenarios } from "stores/scenarioStore";
import { useSimulationStore } from "stores/simulationStore";
import { ScenarioPhase } from "types/scenario";

export const SceneSelector = () => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [, simulationStateActions] = useSimulationStore();
  const [selectedScenarios] = useSelectedScenarios();

  useEffect(() => {
    // Load GLTFs in Configurator only due to strain on performance
    if (buildingService.geometries && buildingService.building) {
      buildingServiceActions.loadGLTFs(buildingService.geometries, buildingService.building);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingService.geometries, buildingService.building]);

  useEffect(() => {
    if (selectedScenarios.length > 0) {
      getBuildingAndConfiguration(selectedScenarios[0].id);
    }
  }, [selectedScenarios]);

  useEffect(() => {
    return () => {
      buildingServiceActions.clearBuildingServiceStore();
    };
  }, []);

  const getBuildingAndConfiguration = (scenarioId: string) => {
    if (!buildingService.configuration) buildingServiceActions.getConfigurationByScenarioId(scenarioId);

    if (!buildingService.building && selectedScenarios[0].phase === ScenarioPhase.Solved)
      buildingServiceActions.getBuilding(scenarioId);
  };

  if (!buildingService.configuration) {
    return null;
  }

  const buildingIsSolved = buildingService.building && buildingService.status === CONFIGURATOR_STATE.SOLVED;

  const viewingSimulation = simulationStateActions.viewingSimulation();

  // Simulation meshes dont align perfectly to solved buildings so we show unsolved instead.
  const showSolvedScene = buildingIsSolved && !viewingSimulation;

  return (
    <>
      {showSolvedScene && (
        <>
          <SolvedBuildingScene />
          <PlotLabels />
        </>
      )}

      <ConfiguratorScene />
    </>
  );
};
