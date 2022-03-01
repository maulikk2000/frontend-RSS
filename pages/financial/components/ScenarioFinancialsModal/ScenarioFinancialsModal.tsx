import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import Modal from "styling/components/Modal/Modal";
import classes from "./ScenarioFinancialsModal.module.scss";

type ScenarioFinancialsModalProps = {
  closeModal: () => void;
  scenarioId: string;
  scenarioName: string;
};

export const ScenarioFinancialsModal: React.FC<ScenarioFinancialsModalProps> = ({
  closeModal,
  scenarioId,
  scenarioName
}) => {
  const [loading, setLoading] = useState(true);
  const [streamlitUrlSrc, setStreamlitUrlSrc] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(true);

  useEffect(() => {
    if (scenarioId) {
      setStreamlitUrlSrc(
        process.env.REACT_APP_STREAMLIT_URL + "?scenarioId=" + scenarioId + "&scenarioName=" + scenarioName
      );
    }
  }, [scenarioName, scenarioId]);

  const handleIframeLoaded = () => {
    setLoading(false);
  };

  const handleClose = () => {
    setModalIsOpen(false);
    closeModal();
  };

  return (
    <Modal isOpen={modalIsOpen} close={handleClose} type="mostScreen">
      <div className={classes.ScenarioFinancials}>
        {loading ? (
          <div className={classes.loading}>
            <LoadingSpinner />
          </div>
        ) : null}
        <iframe
          name="streamlit-ew-financial"
          src={streamlitUrlSrc}
          width="100%"
          height="100%"
          referrerPolicy="no-referrer"
          seamless
          scrolling="false"
          frameBorder={0}
          onLoad={handleIframeLoaded}
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </Modal>
  );
};
