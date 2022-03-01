import React, { useEffect, useMemo, useRef, useState } from "react";
import { RightModal } from "pages/components/RightModal/RightModal";
import { AnalysisChoice, AnalysisType } from "./AnalysisChoice";
import { Button } from "styling/components/Button/Button";
import classes from "./SimulationModal.module.scss";
import { usePoll, useSelectAnalysis } from "./hooks";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";

type SimulationModalProps = {
  closeModal: () => void;
};

export const SimulationModal: React.FC<SimulationModalProps> = ({ closeModal }) => {
  const [selected, setSelected] = useState<AnalysisType | null>(null);
  const polling = usePoll();
  const selectAnalysisHandler = useSelectAnalysis(polling);

  // Close the modal if the configID changes. To avoid chance of modal showing
  // results of previous configID.
  const [buildingService] = useV2BuildingServiceStore();
  const configurationId = buildingService.configuration?.id;
  const closeModalRef = useRef(closeModal);
  closeModalRef.current = useMemo(() => closeModal, [closeModal]);
  useEffect(() => () => closeModalRef.current(), [configurationId]);

  return (
    <RightModal title="Analysis" caption="Select an analysis to apply to your massing." onClose={closeModal}>
      <AnalysisChoice
        mode="solar"
        state={polling.status?.solar ?? "draft"}
        onClicked={() => {
          setSelected("solar");
        }}
        isChecked={selected === "solar"}
      />
      <AnalysisChoice
        mode="wind"
        state={polling.status?.wind ?? "draft"}
        onClicked={() => {
          setSelected("wind");
        }}
        isChecked={selected === "wind"}
      />
      <div className={classes.buttonContainer}>
        <Button
          classType="primary"
          onClick={() => selected !== null && selectAnalysisHandler(selected)}
          disabled={
            polling.status === null ||
            (polling.status.wind === "pending" && selected === "wind") ||
            (polling.status.solar === "pending" && selected === "solar") ||
            !polling.status.isMassingAvailable
          }
        >
          Select
        </Button>
      </div>
    </RightModal>
  );
};
