import React from "react";
import classes from "./SiteDetail.module.scss";
import { Button } from "styling/components";

export interface DetailCardToggleProps {
  show?: boolean;
}

interface SiteDetailEditProps extends DetailCardToggleProps {
  title: string;
  description: string;
  onClick: () => void;
  btnText: string;
  icon?: any;
  disabled?: boolean;
  analyticsId?: string;
}

const SiteDetailCard: React.FC<SiteDetailEditProps> = ({
  title,
  description,
  onClick,
  btnText,
  icon,
  analyticsId,
  disabled,
  show
}) => {
  return show ? (
    <div className={classes.card}>
      <h1>{title}</h1>
      <p className="lowlight">{description}</p>
      <Button classType="primary" onClick={onClick} analyticsId={analyticsId} disabled={disabled}>
        {icon}
        <span className={!icon ? "" : classes.hasIcon}>{btnText}</span>
      </Button>
    </div>
  ) : null;
};

export default SiteDetailCard;
