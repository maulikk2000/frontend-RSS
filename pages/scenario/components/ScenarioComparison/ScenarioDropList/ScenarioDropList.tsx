import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC } from "react";
import classes from "./SelectDropList.module.scss";
import { ReactComponent as Icon } from "./dropListIcon.svg";
import "./dropList.scss";
import ScenarioPhaseTag from "styling/components/ScenarioPhaseTag/ScenarioPhaseTag";
import { Scenario } from "types/scenario";
interface Props {
  onChange: (event: React.ChangeEvent<{ value: unknown }>, targetDropListKey: string) => void;
  dropListKey: string;
  selectedScenarioId?: string;
  dropListOptions: Scenario[];
}

export const ScenarioDropList: FC<Props> = ({ onChange, dropListKey, selectedScenarioId, dropListOptions }) => {
  return (
    <Select
      onChange={(e) => onChange(e, dropListKey)}
      key={dropListKey}
      className={`${classes.scenarioDropList} scenarioDropList`}
      value={selectedScenarioId ? selectedScenarioId : "select"}
      IconComponent={Icon}
    >
      <MenuItem value="select" key={dropListKey + "select"}>
        <div>
          <div className={classes.listItemHeader}>Select Scenario</div>
          <ScenarioPhaseTag />
        </div>
      </MenuItem>
      {dropListOptions.map((scenario) => (
        <MenuItem value={scenario.id} key={dropListKey + scenario.id}>
          <div>
            <div className={classes.listItemHeader}>
              {scenario.name}
              {scenario.isBaselineScenario && (
                <>
                  &nbsp;&nbsp;
                  <label className={classes.baseline}>Baseline</label>
                </>
              )}
            </div>
            <ScenarioPhaseTag phase={scenario.phase} />
          </div>
        </MenuItem>
      ))}
    </Select>
  );
};
