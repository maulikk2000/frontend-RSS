import { FC } from "react";
import classes from "./CustomModal.module.scss";
import { Button } from "styling/components/Button/Button";
import Modal, { modalStyle } from "styling/components/Modal/Modal";
import ModalActions from "styling/components/Modal/ModalActions";

interface CustomModalProps {
  title?: string;
  description?: string;
  buttons: ModalButton[];
  isOpen: boolean;
  handleClose?: () => void;
  shouldDisableClose?: boolean;
  type?: modalStyle;
}

type ModalButton = {
  text: string;
  onClick: () => void;
  type: "primary" | "secondary";
};

export const CustomModal: FC<CustomModalProps> = ({
  title = "Please confirm",
  description = "Would you like to proceed with this action?",
  buttons,
  isOpen,
  handleClose,
  shouldDisableClose,
  type
}) => {
  return (
    <Modal isOpen={isOpen} close={handleClose} shouldDisableClose={shouldDisableClose} type={type ?? "create"}>
      <h1>{title}</h1>
      <div className={classes.modalDescription}>{description}</div>
      <ModalActions>
        <div className={classes.actionButtons}>
          {buttons.map((button, idx) => (
            <Button key={`${button.text}-${idx}`} classType={button.type} onClick={button.onClick}>
              {button.text}
            </Button>
          ))}
        </div>
      </ModalActions>
    </Modal>
  );
};
