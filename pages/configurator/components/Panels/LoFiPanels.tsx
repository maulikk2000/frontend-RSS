import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ConfiguredMetrics } from "../ConfiguredMetrics/ConfiguredMetrics";
import { MassingEditorWorkflow } from "pages/scenario/components/MassingEditorWorkflow/MassingEditorWorkflow";
import { useState } from "react";
import { useSelectedScenarios } from "stores/scenarioStore";
import { ColourLegend } from "./ColourLegend/ColourLegend";
import { EditorPanel } from "./EditorPanel/EditorPanel";
import { MapControlPanel } from "./MapControlPanel/MapControlPanel";
import { RotationPromptPanel } from "./RotationPromptPanel/RotationPromptPanel";
import { SolvedExplorePanel } from "./SolvedExplorePanel/SolvedExplorePanel";
import { useSimulationStore } from "stores/simulationStore";
import { ScenarioPhase } from "types/scenario";

export const LoFiPanels = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [simulationStore, simulationStateActions] = useSimulationStore();
  const [selectedScenarios] = useSelectedScenarios();
  const [panelDocked, setPanelDocked] = useState(false);

  return (
    <>
      <MapControlPanel editorPanelDocked={panelDocked} />
      <RotationPromptPanel />

      {selectedScenarios.length > 0 &&
        selectedScenarios[0].phase !== ScenarioPhase.Solved &&
        !simulationStateActions.viewingSimulation() && <MassingEditorWorkflow />}

      {selectedScenarios.length > 0 &&
        selectedScenarios[0].phase !== ScenarioPhase.Solved &&
        buildingService.configuration && (
          <>
            <EditorPanel setIsDocked={setPanelDocked} isDocked={panelDocked} />
            <ConfiguredMetrics />
          </>
        )}

      {buildingService.building && (
        <>
          <SolvedExplorePanel setIsDocked={setPanelDocked} isDocked={panelDocked} />
          <ColourLegend />
        </>
      )}
    </>
  );
};
