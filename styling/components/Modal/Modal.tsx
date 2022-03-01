import React, { FC } from "react";
import CloseIcon from "@material-ui/icons/Close";
import classes from "./Modal.module.scss";

export type modalStyle = "delete" | "create" | "fullscreen" | "partialscreen" | "mostScreen";
interface ModalProps {
  header?: string;
  isOpen: boolean;
  close?: () => void;
  type: modalStyle;
  id?: string;
  shouldDisableClose?: boolean;
}

const Modal: FC<ModalProps> = ({ header, isOpen = false, type, children, close, id, shouldDisableClose }) => {
  const handleClose = () => {
    if (close) {
      close();
    }
  };

  const content = React.Children.map(children, (child) => {
    if (child) {
      if (child!["type"]["name"] !== "ModalActions") {
        return child;
      }
    }
  });

  const actions = React.Children.map(children, (child) => {
    if (child!["type"]["name"] === "ModalActions") {
      return child;
    }
  });

  const shouldDisplayHeader = header || !shouldDisableClose;

  return (
    <div className={classes.modal + " " + (isOpen ? classes.open : classes.closed)}>
      <div className={classes[type]}>
        {shouldDisplayHeader && (
          <div className={classes.modalHeader}>
            {header && <h2>{header}</h2>}
            {!shouldDisableClose && <CloseIcon id={id} className={classes.closeIcon} onClick={handleClose} />}
          </div>
        )}

        <div className={classes.modalContent}>{content}</div>
        <div className={classes.modalActions}>{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
