import React, { FC } from "react";
import { SelectTemplateOption } from "../../data/types";
import { ReactComponent as CheckTick } from "styling/assets/icons/configurator/CheckTick.svg";
import { ReactComponent as SmallBuildingFootprint } from "styling/assets/icons/selectTemplate/small_building_footprint.svg";
import { ReactComponent as LargerBuildingFootprint } from "styling/assets/icons/selectTemplate/larger_building_footprint.svg";
import { ReactComponent as CustomMassing } from "styling/assets/icons/selectTemplate/custom_massing.svg";
import classes from "./Option.module.scss";

interface OptionProps {
  option: SelectTemplateOption;
  onClick: (selection) => void;
  isSelected: boolean;
}

export const Option: FC<OptionProps> = ({ option, onClick, isSelected }) => {
  const iconComponents = {
    SmallBuildingFootprint: SmallBuildingFootprint,
    LargerBuildingFootprint: LargerBuildingFootprint,
    CustomMassing: CustomMassing
  };

  let icon = "";

  if (option.icon != null) {
    if (iconComponents.hasOwnProperty(option.icon)) icon = option.icon;
  }

  const IconComponent = iconComponents[icon.toString()];

  return (
    <div
      className={`${classes.option} imageBoxHover`}
      {...(!option.isDisabled && { onClick: () => onClick(option.id) })}
    >
      <div
        className={
          isSelected
            ? `${classes.imageBox} ${classes.selected} selected`
            : option.isDisabled
            ? `${classes.imageBox} ${classes.disabled}`
            : ""
            ? `${classes.imageBox} ${classes.highlight}`
            : classes.imageBox
        }
      >
        <CheckTick className={classes.check} />
        <IconComponent />
      </div>
      <label>{option.name}</label>
    </div>
  );
};
