import React, { FC, SVGProps } from "react";
import classes from "./IconButton.module.scss";

type IconButtonProps = {
  onClick: () => void;
  title: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

export const IconButton: FC<IconButtonProps> = ({ onClick, title, Icon }: IconButtonProps) => {
  return (
    <div className={classes.iconButton}>
      <button onClick={onClick}>
        {<Icon />}
        <p>{title}</p>
      </button>
    </div>
  );
};
