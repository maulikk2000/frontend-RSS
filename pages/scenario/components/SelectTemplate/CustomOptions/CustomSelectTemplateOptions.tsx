import * as React from "react";
import classes from "./CustomSelectTemplateOptions.module.scss";
import { SelectTemplateOption } from "../data/types";
import { Option } from "./Option/Option";
import { Tooltip } from "styling/components/ToolTip/Navy/Tooltip";

export interface CustomSelectTemplateOptionsProps {
  options: Array<SelectTemplateOption>;
  onClick: (selection) => void;
  optionSelected: string;
  center?: boolean;
}

const CustomSelectTemplateOptions: React.FC<CustomSelectTemplateOptionsProps> = ({
  options,
  onClick,
  optionSelected,
  center = true
}) => {
  const isSelected = (optionId, optionSelected) => {
    let selection = optionSelected;
    if (typeof optionSelected === "object") {
      selection = optionSelected.id;
    }
    return optionId === selection;
  };

  return (
    <div
      className={
        center === true
          ? `${classes.optionWrapper} ${classes.centre} ${classes.container}`
          : `${classes.optionWrapper} ${classes.container}`
      }
    >
      {options.map((option, index) => {
        return (
          <Tooltip key={option.id} message={option.tooltip} position="bottom">
            <Option
              key={option.id}
              option={option}
              onClick={onClick}
              isSelected={isSelected(option.id, optionSelected)}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};

export default CustomSelectTemplateOptions;
