import React, { useState } from "react";
import classes from "./LayerToggleControls.module.scss";
import { Toggle } from "../Toggle/Toggle";
import { sortBy } from "lodash-es";

export interface ToggleItem {
  id: string;
  name: string;
  isOn: boolean;
  group?: string;
  order?: number;
}

export interface Props {
  items?: ToggleItem[];
  handleLayerToggle: (currentId: string) => void;
  title?: string;
  subtitle?: string;
}

/**
 * Toggling layers on top of the map
 * TODO: make icon an optional parameter
 */
export const LayerToggleControls: React.FC<Props> = ({ items = [], handleLayerToggle, title, subtitle }) => {
  const sortedItems = sortBy(items, ["group", "order"]);

  return (
    <div className={classes.panelWrapper}>
      <div className={classes.headerWrapper}>
        <h2>{title}</h2>
        <p className="lowlight">
          {subtitle}
        </p>
      </div>

      {sortedItems?.map((item, i) => {
        const lastItemInGroup = sortedItems?.[i + 1]?.group !== item.group;
        const firstItemInGroup = i > 0 && sortedItems?.[i - 1]?.group !== item.group;
        const lastRow = sortedItems.length === i + 1;

        return (
          <div
            key={item.id}
            className={`${classes.options} ${firstItemInGroup && classes.firstRowInGroup} ${
              lastItemInGroup && classes.lastRowInGroup
            } ${lastRow && classes.lastRow}`}
          >
            <div className={classes.cell}>{item.name}</div>
            <div className={classes.togglecell}>
              <Toggle toggle={item.isOn} title={""} onChange={() => handleLayerToggle(item.id)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LayerToggleControls;
