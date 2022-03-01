import React, { useEffect, useReducer, useState } from "react";
import { useScenarioStore } from "stores/scenarioStore";
import Accordion from "styling/components/Accordion/Accordion";
import {
  ActualUnitMixHeaderMappings,
  defaultMeasurementUnit,
  FloorplateHeaderMappings,
  MassingMetricsHeaderMappings
} from "utils/constants";
import { BackToProjectLink } from "pages/scenario/components/BackToProjectLink/BackToProjectLink";
import { MetricsComparison } from "./ComparisonGroups/MetricsComparison";
import { UnitMixComparison } from "./ComparisonGroups/UnitMixComparison";
import { ExportToCsv } from "./ExportToCsv";
import classes from "./ScenarioComparison.module.scss";
import { ScenarioDropList } from "./ScenarioDropList/ScenarioDropList";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import { Scenario, ScenarioPhase, ScenarioComparisonModel } from "types/scenario";
import { useSelectedWorkspace } from "stores/workspaceStore";

interface ScenarioComparisonDroplistState {
  Selection: string | undefined; // This is a scenario Id
  OptionList: Scenario[];
  IsLoading: boolean;
  Data: ScenarioComparisonModel | undefined; // This is the scenario's site data for the selected scenario
}

enum ScenarioComparisonDroplistAction {
  Selection,
  Data,
  OptionList
}

export const ScenarioComparison = () => {
  const [scenarioState, scenarioActions] = useScenarioStore();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;
  const dropListKeys = ["scenarioList1", "scenarioList2", "scenarioList3"];

  const dropListReducer = (state: ScenarioComparisonDroplistState, action) => {
    switch (action.type) {
      case ScenarioComparisonDroplistAction.Selection:
        return action.Selection === state.Selection
          ? state
          : {
              ...state,
              Selection: action.Selection,
              IsLoading: action.Selection ? true : false
            };
      case ScenarioComparisonDroplistAction.Data:
        return {
          ...state,
          IsLoading: state.Selection && !action.Data ? true : false,
          Data: action.Data
        };
      case ScenarioComparisonDroplistAction.OptionList:
        return {
          ...state,
          OptionList: action.OptionList
        };
      default:
        return state;
    }
  };

  const [dropList1, dispatchDropList1] = useReducer(dropListReducer, {
    Selection: undefined,
    OptionList: [],
    IsLoading: false,
    Data: undefined
  });

  const [dropList2, dispatchDropList2] = useReducer(dropListReducer, {
    Selection: undefined,
    OptionList: [],
    IsLoading: false,
    Data: undefined
  });
  const [dropList3, dispatchDropList3] = useReducer(dropListReducer, {
    Selection: undefined,
    OptionList: [],
    IsLoading: false,
    Data: undefined
  });

  const [massingMetricsIsOpen] = useState<boolean>(true);
  const [floorPlateMetricsIsOpen] = useState<boolean>(true);
  const [unitMetricsIsOpen] = useState<boolean>(true);

  const loadScenarioComparisons = () => {
    if (scenarioState.selectedScenarioIds.length > 0) {
      // Load comparison data for initial selections
      scenarioActions.getScenariosComparison(...scenarioState.selectedScenarioIds);
    }

    // Set initial selections
    dispatchDropList1({
      type: ScenarioComparisonDroplistAction.Selection,
      Selection: scenarioState.selectedScenarioIds.length > 0 ? scenarioState.selectedScenarioIds[0] : undefined
    });

    dispatchDropList2({
      type: ScenarioComparisonDroplistAction.Selection,
      Selection: scenarioState.selectedScenarioIds.length > 1 ? scenarioState.selectedScenarioIds[1] : undefined
    });

    dispatchDropList3({
      type: ScenarioComparisonDroplistAction.Selection,
      Selection: scenarioState.selectedScenarioIds.length > 2 ? scenarioState.selectedScenarioIds[2] : undefined
    });
  };

  const updateDropListOptions = () => {
    dispatchDropList1({
      type: ScenarioComparisonDroplistAction.OptionList,
      OptionList: scenarioState.scenarios.filter(
        (s) => s.phase === ScenarioPhase.Solved && s.id !== dropList2.Selection && s.id !== dropList3.Selection
      )
    });

    dispatchDropList2({
      type: ScenarioComparisonDroplistAction.OptionList,
      OptionList: scenarioState.scenarios.filter(
        (s) => s.phase === ScenarioPhase.Solved && s.id !== dropList1.Selection && s.id !== dropList3.Selection
      )
    });

    dispatchDropList3({
      type: ScenarioComparisonDroplistAction.OptionList,
      OptionList: scenarioState.scenarios.filter(
        (s) => s.phase === ScenarioPhase.Solved && s.id !== dropList1.Selection && s.id !== dropList2.Selection
      )
    });
  };

  useEffect(() => {
    loadScenarioComparisons();
    updateDropListOptions();
  }, [scenarioState.selectedScenarioIds, scenarioState.scenarios]);

  useEffect(() => {
    return () => {
      scenarioActions.clearScenarioComparison();
    };
  }, []);

  useEffect(() => {
    const data = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList1.Selection);
    dispatchDropList1({
      type: ScenarioComparisonDroplistAction.Data,
      Data: data
    });
    updateDropListOptions();
  }, [dropList1.Selection]);

  useEffect(() => {
    const data = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList2.Selection);
    dispatchDropList2({
      type: ScenarioComparisonDroplistAction.Data,
      Data: data
    });
    updateDropListOptions();
  }, [dropList2.Selection]);

  useEffect(() => {
    const data = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList3.Selection);
    dispatchDropList3({
      type: ScenarioComparisonDroplistAction.Data,
      Data: data
    });
    updateDropListOptions();
  }, [dropList3.Selection]);

  useEffect(() => {
    // Update drop down list data and isLoading
    if (dropList1.IsLoading) {
      const data1 = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList1.Selection);
      dispatchDropList1({
        type: ScenarioComparisonDroplistAction.Data,
        Data: data1
      });
    }
    if (dropList2.IsLoading) {
      const data2 = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList2.Selection);
      dispatchDropList2({
        type: ScenarioComparisonDroplistAction.Data,
        Data: data2
      });
    }
    if (dropList3.IsLoading) {
      const data3 = scenarioState.scenariosComparison.find((c) => c.scenarioId === dropList3.Selection);
      dispatchDropList3({
        type: ScenarioComparisonDroplistAction.Data,
        Data: data3
      });
    }
  }, [scenarioState.scenariosComparison, scenarioState.compareScenariosState]);

  const updateDropListSelection = (selectedScenarioId, dropListKey) => {
    switch (dropListKey) {
      case dropListKeys[0]:
        dispatchDropList1({
          type: ScenarioComparisonDroplistAction.Selection,
          Selection: selectedScenarioId
        });
        break;
      case dropListKeys[1]:
        dispatchDropList2({
          type: ScenarioComparisonDroplistAction.Selection,
          Selection: selectedScenarioId
        });
        break;
      case dropListKeys[2]:
        dispatchDropList3({
          type: ScenarioComparisonDroplistAction.Selection,
          Selection: selectedScenarioId
        });
        break;
      default:
        break;
    }
  };

  const handleScenarioSelection = (e: React.ChangeEvent<{ value: unknown }>, targetDropListKey: string) => {
    e.persist();

    const selectedScenarioId =
      !e.target || !e.target.value || e.target.value === "select" ? undefined : (e.target.value as string);
    updateDropListSelection(selectedScenarioId, targetDropListKey);

    if (selectedScenarioId) {
      let alreadyExists = scenarioState.scenariosComparison.find((cm) => cm.scenarioId === selectedScenarioId);

      if (!alreadyExists) {
        scenarioActions.getScenariosComparison(selectedScenarioId);
      }
    }
  };

  return (
    <div className={classes.scenarioComparison} id={"ScenarioComparison"}>
      <div className={classes.header}>
        <div className={classes.headingWithButton}>
          <BackToProjectLink />
          <h1 className={classes.compHeader}>
            <span>Scenario</span>Comparison
          </h1>
        </div>
        <div className={classes.csvButton}>
          <ExportToCsv scenarioComparisonsToExport={[dropList1.Data, dropList2.Data, dropList3.Data]} />
        </div>
      </div>
      <div className={classes.mainContent}>
        <div className={classes.selectorRow}>
          <div className={classes.blankCell}></div>
          <div className={classes.dropCellFirst}>
            <ScenarioDropList
              onChange={handleScenarioSelection}
              dropListKey={dropListKeys[0]}
              selectedScenarioId={dropList1.Selection}
              dropListOptions={dropList1.OptionList}
            />
          </div>
          <div className={classes.dropCell}>
            <ScenarioDropList
              onChange={handleScenarioSelection}
              dropListKey={dropListKeys[1]}
              selectedScenarioId={dropList2.Selection}
              dropListOptions={dropList2.OptionList}
            />
          </div>
          <div className={classes.dropCellLast}>
            <ScenarioDropList
              onChange={handleScenarioSelection}
              dropListKey={dropListKeys[2]}
              selectedScenarioId={dropList3.Selection}
              dropListOptions={dropList3.OptionList}
            />
          </div>
        </div>
        <div className={classes.comparisonDataWrapper}>
          <Accordion display="table" header="Massing Metrics" isOpen={massingMetricsIsOpen}>
            <div className={classes.sectionRow}>
              <div className={classes.sectionCol}>
                <div className={classes.headerCell}>
                  <span>
                    <b>Massing Metrics</b>
                  </span>
                </div>
                {MassingMetricsHeaderMappings(measurementUnit).map((header) => (
                  <div key={header.label} className={classes.headerCell}>
                    {header.label}
                  </div>
                ))}
              </div>
              <div className={classes.comparisonCol}>
                {dropList1.IsLoading && (
                  <div className={classes.loading}>
                    <LoadingSpinner />
                  </div>
                )}
                <MetricsComparison
                  scenarioMetrics={dropList1.Data}
                  metricsMappings={MassingMetricsHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="massingMetrics"
                />
              </div>
              <div className={classes.comparisonCol}>
                {dropList2.IsLoading && (
                  <div className={classes.loading}>
                    <LoadingSpinner />
                  </div>
                )}
                <MetricsComparison
                  scenarioMetrics={dropList2.Data}
                  metricsMappings={MassingMetricsHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="massingMetrics"
                />
              </div>
              <div className={classes.comparisonCol}>
                {dropList3.IsLoading && (
                  <div className={classes.loading}>
                    <LoadingSpinner />
                  </div>
                )}
                <MetricsComparison
                  scenarioMetrics={dropList3.Data}
                  metricsMappings={MassingMetricsHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="massingMetrics"
                />
              </div>
            </div>
          </Accordion>
          <Accordion display="table" header="Floor Plate Metrics" isOpen={floorPlateMetricsIsOpen}>
            <div className={classes.sectionRow}>
              <div className={classes.sectionCol}>
                <div className={classes.headerCell}>
                  <b>Floor Plate Metrics</b>
                </div>
                {FloorplateHeaderMappings(measurementUnit).map((header) => (
                  <div key={header.label} className={classes.headerCell} data-title={header.description}>
                    {header.label}
                  </div>
                ))}
              </div>
              <div className={classes.comparisonCol}>
                <MetricsComparison
                  scenarioMetrics={dropList1.Data}
                  metricsMappings={FloorplateHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="floorPlateMetrics"
                />
              </div>
              <div className={classes.comparisonCol}>
                <MetricsComparison
                  scenarioMetrics={dropList2.Data}
                  metricsMappings={FloorplateHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="floorPlateMetrics"
                />
              </div>
              <div className={classes.comparisonCol}>
                <MetricsComparison
                  scenarioMetrics={dropList3.Data}
                  metricsMappings={FloorplateHeaderMappings(measurementUnit)}
                  plotMetricPropertyName="floorPlateMetrics"
                />
              </div>
            </div>
          </Accordion>
          <Accordion display="table" header="Unit Metrics" isOpen={unitMetricsIsOpen}>
            <div className={classes.sectionRow}>
              <div className={classes.sectionCol}>
                <div className={classes.headerCell}>
                  <b>Unit Metrics</b>
                </div>
                {ActualUnitMixHeaderMappings.map((header) => (
                  <div key={header.label} className={classes.headerCell}>
                    {header.label}
                  </div>
                ))}
              </div>
              <div className={classes.comparisonCol}>
                <UnitMixComparison scenarioMetrics={dropList1.Data} />
              </div>
              <div className={classes.comparisonCol}>
                <UnitMixComparison scenarioMetrics={dropList2.Data} />
              </div>
              <div className={classes.comparisonCol}>
                <UnitMixComparison scenarioMetrics={dropList3.Data} />
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
