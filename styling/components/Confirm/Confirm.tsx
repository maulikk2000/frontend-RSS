import React, { FC, ReactNode } from "react";
import { Overlay } from "../Overlay/Overlay";
import classes from "./Confirm.module.scss";
import { Button } from "../Button/Button";
import { ReactComponent as CloseIcon } from "styling/assets/icons/close_icon.svg";

export interface Props {
  message?: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isDisplayed: boolean;
  okText?: string;
  cancelText?: string;
}

export const Confirm: FC<Props> = ({ message, onConfirm, onCancel, isDisplayed, okText, cancelText }) => {
  const msg = typeof message === "string" ? <p>{message}</p> : message;
  return (
    <>
      {isDisplayed && (
        <Overlay>
          <div className={classes.confirmBox}>
            <div onClick={onCancel} className={classes.close}>
              <CloseIcon />
            </div>
            {msg}
            <div className={classes.buttonWrapper}>
              <Button classType="primary" onClick={onConfirm}>
                {okText ?? "OK"}
              </Button>
              <Button classType="secondary" onClick={onCancel}>
                {cancelText ?? "Cancel"}
              </Button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
};
