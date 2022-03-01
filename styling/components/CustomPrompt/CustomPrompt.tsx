import React, { ReactNode, useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import { Confirm } from "styling/components/Confirm/Confirm";
import { useHistory } from "react-router";

export type Props = {
  when: boolean;
  message: string | ReactNode;
};

/**
 * A wrapper for react-router-dom Prompt to display `Confirm` Modal
 */
export const CustomPrompt: React.FC<Props> = ({ when, message }) => {
  const [show, setShow] = useState(false);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      history.push(lastLocation.pathname);
    }
  }, [confirmedNavigation, lastLocation]);

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation && when) {
      setShow(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setShow(false);
    setConfirmedNavigation(true);
  };

  return (
    <>
      <Confirm
        message={message}
        isDisplayed={show}
        onConfirm={handleConfirmNavigationClick}
        onCancel={() => setShow(false)}
      />
      <Prompt when={when} message={handleBlockedNavigation} />
    </>
  );
};

export default CustomPrompt;
