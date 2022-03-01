export type ModalFunctionType = {
  setModalDescription: (description: string) => void;
  setConfirmCallback: (callback: () => void) => void;
  toggleModal: () => void;
};
