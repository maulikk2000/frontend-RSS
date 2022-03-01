import { useSelectedScenarios } from "stores/scenarioStore";
import ScenarioPhaseTag from "styling/components/ScenarioPhaseTag/ScenarioPhaseTag";
import classes from "./ScenarioDetails.module.scss";

export const ScenarioDetails = () => {
  const [selectedScenarios] = useSelectedScenarios();

  return (
    <div className={classes.scenarioDetails}>
      <div className={classes.detailsWrapper}>
        <div className={classes.left}>
          <h6>Scenario</h6>
          <h3>{selectedScenarios.length > 0 ? selectedScenarios[0].name : null}</h3>
        </div>
        <div className={classes.right}>
          <h6>Status</h6>
          <ScenarioPhaseTag phase={selectedScenarios.length > 0 ? selectedScenarios[0].phase : undefined} />
        </div>
      </div>
      <p>Select tab to view metrics</p>
    </div>
  );
};
