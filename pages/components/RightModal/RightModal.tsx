import { Close } from "@material-ui/icons";
import React, { FC } from "react";
import classes from "./RightModal.module.scss";

type RightModalProps = {
  title: string;
  caption?: string;
  onClose: () => void;
};

export const RightModal: FC<RightModalProps> = ({ title, caption, onClose, children }) => (
  <div className={classes.container}>
    <div className={classes.header}>
      <div className={classes.titleSection}>
        <span className={classes.title}>{title}</span>
        {caption && <div className={classes.caption}>{caption}</div>}
      </div>
      <button className={classes.closeButton}>
        <Close fontSize="small" onClick={() => onClose()} />
      </button>
    </div>
    <div className={classes.content}>{children}</div>
  </div>
);
