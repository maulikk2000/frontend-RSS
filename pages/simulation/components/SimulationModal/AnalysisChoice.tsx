import React from "react";
import { ReactComponent as WindIcon } from "styling/assets/icons/wind-analysis.svg";
import { ReactComponent as SolarIcon } from "styling/assets/icons/solar-analysis.svg";
import classes from "./AnalysisChoice.module.scss";
import { AnalysisStatus, CompletionState } from "./AnalysisStatus";
import { RadioButton } from "styling/components/RadioButton/RadioButton";

export type AnalysisType = "solar" | "wind";

type AnalysisChoiceProps = {
  mode: AnalysisType;
  state: CompletionState;
  isChecked: boolean;
  onClicked: () => void;
};

const titles = {
  solar: "Solar Analysis",
  wind: "Wind Analysis"
};

const icons = {
  solar: <SolarIcon />,
  wind: <WindIcon />
};

export const AnalysisChoice = ({ mode, state, isChecked, onClicked }: AnalysisChoiceProps) => {
  const captions = {
    solar: null,
    wind:
      state === "pending"
        ? "Your analysis will be ready when your status updates to 'Solved'"
        : "This may take up to 1 hour to solve"
  };

  const caption = captions[mode];

  return (
    <div className={classes.root} onClick={() => onClicked()}>
      <span className={classes.icon}>{icons[mode]}</span>
      <span className={classes.content}>
        <label>{titles[mode]}</label>
        {caption && <div className={classes.caption}>{caption}</div>}
        <AnalysisStatus state={state} />
      </span>
      <span className={classes.checkbox}>
        <RadioButton label={""} value={""} checked={isChecked} />
      </span>
    </div>
  );
};
