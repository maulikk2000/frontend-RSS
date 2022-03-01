import { Button } from "@material-ui/core";
import { useSnackbar, VariantType } from "notistack";
import { Fragment, useCallback } from "react";
import { MessageState } from "types/extensions/messageExtension";

export const useMessageBar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return useCallback(
    (message?: MessageState) => {
      const showMessageWithAutoHide = (message: string, variant: VariantType) => {
        enqueueSnackbar(message, {
          variant: variant,
          autoHideDuration: 2000,
          preventDuplicate: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
          }
        });
      };

      const showMessageWithCloseButton = (message: string, variant: VariantType) => {
        // custom bar with close button
        const action = (key) => (
          <Fragment>
            <Button onClick={() => closeSnackbar(key)}>Dismiss</Button>
          </Fragment>
        );

        enqueueSnackbar(message, {
          variant: variant,
          //autoHideDuration: 5000,
          preventDuplicate: true,
          persist: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
          },
          action
        });
      };

      if (message && message.text) {
        var variantType = message.variant as VariantType;
        switch (variantType) {
          case "error":
            showMessageWithCloseButton(message.text, variantType);
            console.error(message);
            break;
          default:
            showMessageWithAutoHide(message.text, variantType);
            // console.log(message);
            break;
        }
      }
    },
    [closeSnackbar, enqueueSnackbar]
  );
};
