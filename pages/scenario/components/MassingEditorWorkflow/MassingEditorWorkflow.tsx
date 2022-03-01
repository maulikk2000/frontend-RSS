import React, { useState, useEffect } from "react";
import SelectTemplate from "../SelectTemplate/SelectTemplate";
import MassingEditorWorkflowCard from "../MassingEditorWorkflowCard/MassingEditorWorkflowCard";
import classes from "./MassingEditorWorkflow.module.scss";
import { UnitAreaSelection } from "../UnitAreaSelection/UnitAreaSelection";
import { SelectUnitMix } from "../SelectUnitMix/SelectUnitMix";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ApiCallState, ApiCallStateClear } from "types/common";

export type MassingConfigurationStep = {
  number: number;
  headerTextLeft: string;
  headerTextRight: string;
  description: string;
  isComplete: boolean;
  isExpanded: boolean;
  isEnabled: boolean;
  component?: React.ReactNode;
};

export const MassingEditorWorkflow = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [, configSettingsActions] = useConfiguratorSettingsStore();

  const handleCallback = (stepNumber) => {
    if (stepNumber < 3) {
      setCompletedStep(stepNumber);
      setSelectedStep(stepNumber + 1);
    }
  };

  const massingConfigurationSteps = [
    {
      number: 1,
      headerTextLeft: "Select Template",
      headerTextRight: "1 of 3",
      isComplete: false,
      isExpanded: false,
      isEnabled: false,
      description: "Select a template to begin massing configuration",
      component: <SelectTemplate parentCallback={handleCallback} />
    },
    {
      number: 2,
      headerTextLeft: "Set Unit Area Range",
      headerTextRight: "2 of 3",
      isComplete: false,
      isExpanded: false,
      isEnabled: false,
      description: "Set the minimum and maximum BOMA B Unit Net Area per unit type.",
      component: <UnitAreaSelection onClickNext={handleCallback} />
    },
    {
      number: 3,
      headerTextLeft: "Set Unit Mix",
      headerTextRight: "3 of 3",
      isExpanded: false,
      isComplete: false,
      isEnabled: false,
      description: "Set the target unit mix",
      component: <SelectUnitMix />
    }
  ];

  const [massingSteps, setMassingSteps] = useState<Array<MassingConfigurationStep>>(massingConfigurationSteps);

  const [selectedStep, setSelectedStep] = useState<number | undefined>();
  const [completedStep, setCompletedStep] = useState<number>(-1);

  const handleToggle = (stepNumber) => {
    setSelectedStep(stepNumber);
  };

  useEffect(() => {
    const updatedMassingSteps = massingSteps.map((s) => {
      let step = { ...s };
      step.isExpanded = step.number === selectedStep;
      step.isComplete = step.number === completedStep ? true : step.isComplete;
      step.isEnabled = !!buildingService.configuration;
      return step;
    });

    setMassingSteps([...updatedMassingSteps]);
    selectedStep === 1
      ? configSettingsActions.setEditorPanelEnabled(false)
      : configSettingsActions.setEditorPanelEnabled(true);
  }, [selectedStep, completedStep]);

  useEffect(() => {
    if (buildingService.siteConfigurationState === ApiCallState.Idle && selectedStep !== 3) {
      if (buildingService.configuration) {
        setCompletedStep(1);
        setSelectedStep(2);
        // const updatedMassingSteps = massingSteps.map((s) => ({
        //   ...s,
        //   isEnabled: true
        // }));
        // setMassingSteps([...updatedMassingSteps]);
      } else {
        setSelectedStep(1);
      }
    } else if (buildingService.siteConfigurationState === ApiCallStateClear.Cleared) {
      const clearedConfigurationSteps = massingConfigurationSteps;
      clearedConfigurationSteps[0].isExpanded = true;
      setSelectedStep(undefined);
      setMassingSteps(clearedConfigurationSteps);
    }
  }, [buildingService.configuration, buildingService.siteConfigurationState]);

  return (
    <div className={classes.massingEditorWrapper}>
      {massingSteps.map((step) => {
        return (
          <MassingEditorWorkflowCard
            key={step.number}
            stepNumber={step.number}
            isCompleted={step.isComplete}
            headerTextLeft={step.headerTextLeft}
            isExpanded={step.isExpanded}
            isEnabled={step.isEnabled}
            headerTextRight={step.headerTextRight}
            description={step.description}
            component={step.component}
            onToggle={handleToggle}
          />
        );
      })}
    </div>
  );
};
