import { ScenarioComparison } from "../../components/ScenarioComparison/ScenarioComparison";
import { useEffect } from "react";
import { useProjectStore, useSelectedProject } from "stores/projectStore";
import { useScenarioStore, useSelectedScenarios } from "stores/scenarioStore";
import classes from "./ComparisonPage.module.scss";

const ComparisonPage = () => {
  const [projectState, projectActions] = useProjectStore();
  const [scenarioState, scenarioActions] = useScenarioStore();
  const [selectedProject] = useSelectedProject();
  const [selectScenarios] = useSelectedScenarios();

  useEffect(() => {
    scenarioActions.clearScenarioComparison();
  }, []);

  useEffect(() => {
    if (!selectedProject || selectedProject.id != projectState.selectedProjectId) {
      projectActions.getProject(projectState.selectedProjectId);
    }
  }, [projectActions, projectState.selectedProjectId]);

  useEffect(() => {
    if (
      selectScenarios.length === 0 ||
      !scenarioState.selectedScenarioIds.every((selected) => selectScenarios.some((s) => s.id === selected))
    ) {
      scenarioActions.getProjectScenarios(projectState.selectedProjectId);
    }
  }, [scenarioActions, scenarioState.selectedScenarioIds]);

  return (
    <div className={classes.feasibilityWrapper}>
      <div className={classes.mainPanel}>
        <ScenarioComparison />
      </div>
    </div>
  );
};

export default ComparisonPage;
