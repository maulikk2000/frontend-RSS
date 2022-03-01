import React from "react";
import classes from "./AnalysisStatus.module.scss";

export type CompletionState = "draft" | "pending" | "solved";

type AnalysisStatusProps = {
  state: CompletionState;
};

const colours = {
  solved: "#A4D8A9",
  pending: "#F7E095",
  draft: "#000000"
};

const labels = {
  solved: "Solved",
  pending: "Pending",
  draft: ""
};

export const AnalysisStatus = ({ state }: AnalysisStatusProps) =>
  state !== "draft" ? (
    <div className={classes.root}>
      <span className={classes.bullet} style={{ background: colours[state] }}></span>
      <span className={classes.label}>{labels[state]}</span>
    </div>
  ) : null;
