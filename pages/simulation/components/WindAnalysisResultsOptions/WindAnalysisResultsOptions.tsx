import React, { useEffect, useState } from "react";
import { Tooltip } from "styling/components/ToolTip/Navy/Tooltip";
import classes from "./WindAnalysisResultsOptions.module.scss";
import { ReactComponent as InfoIcon } from "styling/assets/icons/info.svg";
import { RadioButton } from "styling/components/RadioButton/RadioButton";
import { RadioGroup } from "@material-ui/core";
import { Toggle } from "styling/components/Toggle/Toggle";
import { SimulationAnalysisResultsOptions } from "../SimulationAnalysisResultsOptions/SimulationAnalysisResultsOptions";
import { useSimulationStore } from "stores/simulationStore";

type windViewOption = {
  comfortCategory: string;
  colour: string; //hex value
  threshold?: string;
  variance?: string;
  tooltip?: string;
  valueId: string;
};

export const WindAnalysisResultsOptions = () => {
  const isolatedViewOptions: Array<windViewOption> = [
    {
      comfortCategory: "Sitting",
      colour: "#B4D9F4",
      threshold: "2.5m/s",
      variance: "< 5%",
      tooltip: "Winds of this speed can be felt on the face.",
      valueId: "Lawson-2001-A"
    },
    {
      comfortCategory: "Standing",
      colour: "#6BB7EE",
      threshold: "4m/s",
      variance: "< 5%",
      tooltip: "Winds of this speed can make things such as reading a newspaper difficult and can blow clothes.",
      valueId: "Lawson-2001-B"
    },
    {
      comfortCategory: "Strolling",
      colour: "#4489DA",
      threshold: "6m/s",
      variance: "< 5%",
      tooltip: "Winds of this speed can raise dust and blow loose sheets of paper around.",
      valueId: "Lawson-2001-C"
    },
    {
      comfortCategory: "Business Walking",
      colour: "#315CCB",
      threshold: "8m/s",
      variance: "< 5%",
      tooltip: "Winds of this speed will be felt on the body.",
      valueId: "Lawson-2001-D"
    },
    {
      comfortCategory: "Uncomfortable",
      colour: "#F1A58D",
      threshold: "10m/s",
      variance: "> 5%",
      tooltip:
        "Winds of this speed can make using umbrellas difficult and blow hair around. The wind will also be quite audible.",
      valueId: "Lawson-2001-E"
    },
    {
      comfortCategory: "Unsafe Frail",
      colour: "#ED7F86",
      threshold: "15m/s",
      variance: "> 0.023%",
      tooltip: "Winds of this speed can impede progress or blow over the elderly.",
      valueId: "Lawson-2001-S15"
    },
    {
      comfortCategory: "Unsafe All",
      colour: "#D05D72",
      threshold: "20m/s",
      variance: "> 0.023%",
      tooltip:
        "These wind speeds are considered dangerous for all pedestrians and measures should be taken to mitigate these speeds",
      valueId: "Lawson-2001-S20"
    }
  ];

  const [simulationState, simulationActions] = useSimulationStore();
  const [showAll, setShowAll] = useState<boolean>(true);

  const handleToggleSwitch = (e) => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    if (newShowAll) {
      simulationActions.setSelectedWindCategory("Lawson-2001-values");
    } else {
      simulationActions.setSelectedWindCategory("Lawson-2001-A");
    }
  };

  const handleViewOptionSelection = (e) => {
    simulationActions.setSelectedWindCategory(e.target.value);
    setShowAll(false);
  };

  return (
    <SimulationAnalysisResultsOptions>
      <div className={classes.WindResultsWrapper}>
        <h1>Lawson 2001 Criteria</h1>
        <p className="lowlight">
          Buildings can create troublesome and dangerous winds in the surrounding areas. This may have an impact on how
          we build our environments.
        </p>
        <div className={classes.showAll}>
          <h2>Select All (Default)</h2>
          <Toggle toggle={showAll} title={""} onChange={handleToggleSwitch} />
        </div>
        <div className={classes.viewOptions}>
          <h2>Isolated view options</h2>
          <p className="lowlight">Select the different levels of wind comfort</p>
          <RadioGroup value={simulationState.selectedWindCategory} onChange={handleViewOptionSelection}>
            {isolatedViewOptions.map((option, i) => {
              return (
                <div className={classes.radioRowWrapper} key={i}>
                  <div className={classes.header}>
                    <RadioButton
                      value={option.valueId}
                      label={
                        <>
                          <div className={classes.colourCode} style={{ backgroundColor: option.colour }}></div>
                          {option.comfortCategory}
                        </>
                      }
                    />
                  </div>
                  <div>{option.threshold}</div>
                  <div>{option.variance}</div>
                  <Tooltip position={"right"} message={option.tooltip}>
                    <InfoIcon />
                  </Tooltip>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </SimulationAnalysisResultsOptions>
  );
};
