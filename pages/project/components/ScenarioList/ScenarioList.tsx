import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useScenarioStore, useSelectedScenarios } from "stores/scenarioStore";
import { Button } from "styling/components/Button/Button";
import { Checkbox } from "styling/components/Checkbox/Checkbox";
import { ReactComponent as PlusIcon } from "styling/assets/icons/plusIcon.svg";
import CreateScenario from "../../../scenario/components/CreateScenario/CreateScenario";
import classes from "./ScenarioList.module.scss";
import { useProjectStore, useSelectedProject } from "stores/projectStore";
import { formatDataForDisplay } from "utils/units";
import { FormattingEnum } from "utils/constants";
import ScenarioPhaseTag from "styling/components/ScenarioPhaseTag/ScenarioPhaseTag";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import { useAnalytics } from "utils/analytics";
import { useSimulationStore } from "stores/simulationStore";
import { BackLink } from "../../../components/BackLink/BackLink";
import { getRoute } from "routes/utils";
import { RouteName } from "routes/types";
import { getPhaseName, Scenario, ScenarioPhase } from "types/scenario";
import { ApiCallState } from "types/common";
import { useWorkspaceStore } from "stores/workspaceStore";

const ScenarioKeyMetrics: React.FC<{ scenario: Scenario }> = ({ scenario }) => {
  return (
    <>
      <dl>
        <div>
          <dt>Yield</dt>
          <dd>{scenario.yield}</dd>
        </div>
        <div>
          <dt>BOMA GEA</dt>
          <dd>{formatDataForDisplay(FormattingEnum.SquareFeet, scenario.bomaGea, 0)}</dd>
        </div>
        <div>
          <dt>BOMA B Efficiency</dt>
          <dd>{formatDataForDisplay(FormattingEnum.Percentage, scenario.bomaBEfficiency, 0)}</dd>
        </div>
      </dl>
    </>
  );
};

export const ScenarioList = () => {
  const history = useHistory();
  const viewMultiText = "Compare Scenarios";
  const viewSingleText = "View Scenario";

  const [scenarioState, scenarioActions] = useScenarioStore();
  const [projectState] = useProjectStore();
  const [selectedProject] = useSelectedProject();
  const [selectedScenarios] = useSelectedScenarios();

  const [, simulationActions] = useSimulationStore();
  const [buttonText, setButtonText] = useState<string>(viewSingleText);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const workspaceRoute = getRoute(RouteName.Workspace);
  const scenarioRoute = getRoute(RouteName.Scenario);
  const scenarioComparisonRoute = getRoute(RouteName.ScenarioComparison);
  const { trackEvent } = useAnalytics();
  const [openCreateScenario, setOpenCreateScenario] = useState<boolean>(false);
  const [newScenarioId] = useState<string>();

  const isChecked = (scenario: Scenario) => {
    if (scenarioState.selectedScenarioIds.some((s) => s === scenario.id)) {
      return true;
    }
    return false;
  };

  const handleCheck = (scenario: Scenario) => {
    scenarioActions.toggleSelectedScenarios(scenario);
  };

  const shouldRejectComparison = (): boolean => {
    if (scenarioState.selectedScenarioIds.length > 1) {
      let allSolved = true;
      selectedScenarios.forEach((s) => {
        if (s.phase !== ScenarioPhase.Solved) {
          allSolved = false;
        }
      });
      if (!allSolved) {
        scenarioActions.setMessageState({
          text: `Please select only ${getPhaseName(ScenarioPhase.Solved)} scenarios for comparison`,
          variant: "warning"
        });
        return true;
      }
    }
    return false;
  };

  const handleViewOrCompareScenarios = () => {
    if (scenarioState.selectedScenarioIds.length === 0) {
      // No selection
      return;
    }

    if (scenarioState.selectedScenarioIds.length > 1) {
      // Handle scenario comparison
      if (shouldRejectComparison()) {
        return;
      }

      history.push(
        scenarioComparisonRoute.getNavPath!({
          selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
          selectedProjectId: projectState.selectedProjectId,
          selectedScenarioIds: scenarioState.selectedScenarioIds.join(",")
        })
      );
    } else if (scenarioState.selectedScenarioIds.length === 1) {
      // Handle view scenario details
      const scenarioId = scenarioState.selectedScenarioIds[0];
      trackEvent("scenario_view", {
        workspace_name: workspaceStore.selectedWorkSpace,
        project_id: projectState.selectedProjectId,
        scenario_id: scenarioId
      });

      // Reset any simulation viewing options or data
      simulationActions.resetSimulationStoreState();
      history.push(
        scenarioRoute.getNavPath!({
          selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
          selectedProjectId: projectState.selectedProjectId,
          selectedScenarioId: scenarioId
        })
      );
    }
  };

  const handleCreateNewScenario = () => {
    setOpenCreateScenario(true);
    trackEvent("scenario_create", {
      workspace_name: workspaceStore.selectedWorkSpace,
      project_id: projectState.selectedProjectId
    });
  };

  const goToScenarioPage = (newScenarioId?: string) => {
    setOpenCreateScenario(false);
    if (newScenarioId) {
      const scenarioUrl = scenarioRoute.getNavPath!({
        selectedWorkSpaceName: workspaceStore.selectedWorkSpace,
        selectedProjectId: projectState.selectedProjectId,
        selectedScenarioId: newScenarioId
      });
      history.push(scenarioUrl);
    }
  };

  useEffect(() => {
    if (scenarioState.selectedScenarioIds.length < 1) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }

    if (scenarioState.selectedScenarioIds.length > 1) {
      setButtonText(viewMultiText);
    } else {
      setButtonText(viewSingleText);
    }
  }, [scenarioState.selectedScenarioIds]);

  useEffect(() => {
    scenarioActions.getProjectScenarios(projectState.selectedProjectId);
  }, [scenarioActions, projectState.selectedProjectId]);

  const [workspaceStore] = useWorkspaceStore();

  return (
    <div className={classes.scenarioListWrapper}>
      <div className={classes.backButton}>
        <BackLink
          to={workspaceRoute.getNavPath!({ selectedWorkSpaceName: workspaceStore.selectedWorkSpace })}
          text={`Back to ${workspaceStore.selectedWorkSpace}`}
        />
      </div>
      <h1>{selectedProject?.name}</h1>
      <p>Select a scenario to view or select multiple scenarios to compare</p>
      <h4>Scenarios</h4>
      <div className={classes.content}>
        <div className={classes.list}>
          {scenarioState.getListState === ApiCallState.Idle ? (
            scenarioState.scenarios.map((scenario, i) => {
              const anyKeyMetricsAvailable =
                scenario.bomaBEfficiency != null || scenario.bomaGea != null || scenario.yield != null;

              return (
                <div className={classes.listItem} key={"scen-" + i} onClick={() => handleCheck(scenario)}>
                  <div>
                    <label>{scenario.name}</label>
                    {scenario.isBaselineScenario && <label className={classes.baseline}>Baseline</label>}
                    {anyKeyMetricsAvailable && <ScenarioKeyMetrics scenario={scenario} />}
                    {scenario.phase != null && (
                      <div className={classes.phaseWrapper}>
                        <ScenarioPhaseTag phase={scenario.phase} />
                      </div>
                    )}
                  </div>
                  <div className={classes.checkbox}>
                    <Checkbox onChange={(e) => {}} checked={isChecked(scenario)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className={classes.messageWrapper}>
              {scenarioState.getListState === ApiCallState.Loading && <LoadingSpinner />}
              {scenarioState.getListState === ApiCallState.Error && (
                <p className={classes.error}>Something wrong while fetching the data. Please refresh the page.</p>
              )}
            </div>
          )}
        </div>
        <div className={classes.boxWrapper} onClick={handleCreateNewScenario}>
          <div>
            <PlusIcon className={classes.createScenarioIcon}></PlusIcon>
            <label className={classes.createScenarioLabel}>Create New Scenario</label>
            <br />
          </div>
        </div>
      </div>

      <div className={classes.cta}>
        <Button classType="primary" onClick={handleViewOrCompareScenarios} disabled={buttonDisabled}>
          {buttonText}
        </Button>
      </div>
      {openCreateScenario && <CreateScenario callBack={goToScenarioPage}></CreateScenario>}
    </div>
  );
};
