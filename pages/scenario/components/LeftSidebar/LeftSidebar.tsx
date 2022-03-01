import { Route, Switch } from "react-router-dom";
import { Metrics } from "../Metrics/Metrics";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import classes from "./LeftSidebar.module.scss";
import { useSimulationStore } from "stores/simulationStore";
import { SolarAnalysisResultsOptions } from "pages/simulation/components/SolarAnalysisResultsOptions/SolarAnalysisResultsOptions";
import { WindAnalysisResultsOptions } from "pages/simulation/components/WindAnalysisResultsOptions/WindAnalysisResultsOptions";
import { getRoutePath } from "routes/utils";
import { RouteName } from "routes/types";

export const LeftSidebar = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [simulationState, simulationStateActions] = useSimulationStore();
  const scenarioRoute = getRoutePath(RouteName.Scenario);

  const showSimulationAnalysisOptions = simulationStateActions.viewingSimulation();

  return (
    <Switch>
      <Route path={scenarioRoute}>
        {buildingService.building && !showSimulationAnalysisOptions && (
          <div className={classes.sidebar} id={"LeftSidebar"}>
            {showSimulationAnalysisOptions ? (
              <>
                {simulationState.selectedSimulationAnalysis?.type === "Solar" && <SolarAnalysisResultsOptions />}

                {simulationState.selectedSimulationAnalysis?.type === "Wind" && <WindAnalysisResultsOptions />}
              </>
            ) : (
              <Metrics />
            )}
          </div>
        )}
        {showSimulationAnalysisOptions && (
          <div className={classes.sidebar} id={"LeftSidebar"}>
            {simulationState.selectedSimulationAnalysis?.type === "Solar" && <SolarAnalysisResultsOptions />}

            {simulationState.selectedSimulationAnalysis?.type === "Wind" && <WindAnalysisResultsOptions />}
          </div>
        )}
      </Route>
    </Switch>
  );
};
