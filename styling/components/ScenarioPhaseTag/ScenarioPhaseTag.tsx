import React from "react";
import { getPhaseName } from "types/scenario";
import Tag from "../Tag/Tag";

interface Props {
  phase?: number;
  showAsPill?: boolean; // Needed for the legacy pages for now
}

const ScenarioPhaseTag: React.FC<Props> = ({ phase, showAsPill }) => {
  let phaseName = phase != null ? getPhaseName(phase) : "No Status";
  if (phaseName == null) {
    phaseName = "";
  }

  return <Tag tag={phaseName} type={phaseName.replace(/\s/g, "")} appearance={showAsPill ? "pill" : "dot"} />;
};

export default ScenarioPhaseTag;
