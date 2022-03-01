import { useEffect } from "react";
import { CONFIGURATOR_STATE } from "pages/configurator/data/enums";
import { PageLoader } from "styling/components/PageLoader/PageLoader";
import { LoaderIcons } from "./LoaderIcons";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import classes from "./ConfigurationSolverLoader.module.scss";
import ReactJson from "react-json-view";
import { useScenarioStore, useSelectedScenarios } from "stores/scenarioStore";
import { useSimulationStore } from "stores/simulationStore";
import { ScenarioPhase } from "types/scenario";

export const ConfigurationSolverLoader = () => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [, scenarioActions] = useScenarioStore();
  const [simulationStore] = useSimulationStore();

  const [selectedScenarios] = useSelectedScenarios();
  const cancelAPICall = () => {
    buildingServiceActions.cancelApiCall();
  };

  useEffect(() => {
    const scenario = selectedScenarios.length > 0 ? selectedScenarios[0] : null;

    if (buildingService.status === CONFIGURATOR_STATE.ERROR) {
      if (scenario) {
        scenario.phase = ScenarioPhase.Draft;
        scenarioActions.updateScenario(scenario);
      }
    } else if (
      buildingService.status === CONFIGURATOR_STATE.SOLVED &&
      scenario &&
      scenario.phase !== ScenarioPhase.Solved
    ) {
      scenario.phase = ScenarioPhase.Solved;
      scenarioActions.updateScenario(scenario);
    }
  }, [buildingService.status]);

  return buildingService.status === CONFIGURATOR_STATE.SOLVING ||
    simulationStore.selectedSimulationAnalysis?.isDataLoading ? (
    <PageLoader title={"Configuring Scene"}>
      <LoaderIcons />
      <small className={classes.buttons + " " + classes.cancel} onClick={cancelAPICall}>
        Cancel
      </small>
    </PageLoader>
  ) : buildingService.status === CONFIGURATOR_STATE.ERROR && buildingService.errors ? (
    <PageLoader title={buildingService.errors.title}>
      {buildingService.errors.errors && (
        <ReactJson
          name={null}
          displayObjectSize={false}
          collapseStringsAfterLength={false}
          displayDataTypes={false}
          style={{
            background: "rgba(255,255,255,0.8)",
            padding: 12
          }}
          enableClipboard={false}
          shouldCollapse={false}
          src={buildingService.errors.errors}
        />
      )}
      <small className={classes.buttons + " " + classes.first} onClick={cancelAPICall}>
        Close
      </small>
    </PageLoader>
  ) : null;
};
