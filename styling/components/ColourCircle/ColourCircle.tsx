import React from "react";
import classes from "./ColourCircle.module.scss";

export type ColourCircleProps = {
  sassVariable?: string;
  title: string;
  name?: string;
  hex: string;
  dark?: boolean;
  opacity?: string;
};

/**
- These components are only used to display colours and aren't used in the application.
- The global colour strategy for Eli is based on the application of two main colours, two supporting highlight colours and a darker tint.
- Primary: This is the primary keystone colour and is used as the main Eli brand colour on the logo and various other areas of the application which we’ll identify across this style guide.
- Secondary: The secondary colour provides supporting contrast to the primary colour and allows for introduction of the subtle elements such tables, graphs and other components.
- Highlight: The highlight colour is primarily used to indicate active states, hover states on CTA’s but also used for data visualisation and to pull out key content on various areas of the application.
**/

export const ColourCircle = ({ title, sassVariable, name, hex, dark, opacity }: ColourCircleProps) => {
  return (
    <div className={classes.colour_circle}>
      <div className={classes.semi_circle_top} style={{ background: hex, opacity: opacity }}></div>
      <i style={dark ? { color: "white" } : {}}>{sassVariable}</i>
      <div>
        <b>{title}</b>
      </div>
      <small>{name}</small>
      <small>{hex}</small>
    </div>
  );
};
