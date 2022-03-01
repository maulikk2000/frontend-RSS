import React from "react";
import classes from "./BreadCrumbs.module.scss";
import { NavLink } from "react-router-dom";

export interface Crumb {
  label: string;
  value: string;
  path?: string;
  id?: string;
}

/**
 * Top Nav Breadcrumb component
 */
const BreadCrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => (
  <div className={classes.wrapper}>
    {crumbs.map((item) => (
      <div className={classes.crumbWrapper} key={item.id}>
        <div className="dashboard-label-lowlight">{item.label}</div>
        <div>
          {item.path ? (
            <NavLink to={item.path} className={classes.link}>
              {item.value}
            </NavLink>
          ) : (
            <h4 className={classes.noLink}>{item.value}</h4>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default BreadCrumbs;
