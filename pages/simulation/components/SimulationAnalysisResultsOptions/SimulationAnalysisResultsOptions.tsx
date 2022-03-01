import { LeftSidebarContent } from "../LeftSidebarContent/LeftSidebarContent";
import { BackLink } from "../../../components/BackLink/BackLink";
import { FC } from "react";
import { useSelectedScenarios } from "stores/scenarioStore";
import { useSimulationStore } from "stores/simulationStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";

export const SimulationAnalysisResultsOptions: FC = ({ children }) => {
  const [selectedScenarios] = useSelectedScenarios();
  const [, simulationActions] = useSimulationStore();

  const [buildingStore] = useV2BuildingServiceStore();

  const handleBackToMetrics = () => simulationActions.resetSimulationStoreState();
  const backText = buildingStore.building
    ? `Back to ${selectedScenarios.length > 0 ? selectedScenarios[0].name : ""} Scenario Metrics`
    : `Back to Massing Editor`;

  return (
    <LeftSidebarContent backLinkComponent={<BackLink to="#" onClick={handleBackToMetrics} text={backText} />}>
      {children}
    </LeftSidebarContent>
  );
};
