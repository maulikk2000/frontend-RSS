import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import React, { useEffect, useMemo, useState } from "react";

import { TowerTools } from "./EditorTools/TowerTools";
import { MoveablePanel } from "../MoveablePanel/MoveablePanel";
import { ToolsColumn } from "../MoveablePanel/ToolsColumn/ToolsColumn";
import { PanelDivider } from "../MoveablePanel/PanelDivider/PanelDivider";
import { SaveTools } from "./SaveTools/SaveTools";
import { HeaderColumn } from "../MoveablePanel/HeaderColumn/HeaderColumn";
import { getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { PodiumTools } from "./EditorTools/PodiumTools";
import { GeneralTools } from "./EditorTools/GeneralTools";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { MeasurementsTool } from "../SolvedExplorePanel/MeasurementsTool/MeasurementsTool";
import { CustomModal } from "styling/components/Modal/CustomModal";

type Props = {
  isDocked: boolean;
  setIsDocked: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditorPanel = ({ isDocked, setIsDocked }: Props) => {
  const [buildingService] = useV2BuildingServiceStore();
  const [configSettings] = useConfiguratorSettingsStore();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalDescription, setModalDescription] = useState<string>("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const setConfigToolsMode = useConfiguratorToolsStore((state) => state.setMode);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const modalFunctions = {
    toggleModal,
    setModalDescription,
    setConfirmCallback
  };

  const handleConfirmation = () => {
    confirmCallback();
    toggleModal();
  };

  const selectedObject = useMemo(() => getSelectedObject(buildingService), [
    buildingService.selectedObjectIndex,
    buildingService.selectedPlotIndex
  ]);

  useEffect(() => {
    setConfigToolsMode("none");
  }, [configSettings.editorPanelEnabled]);

  return (
    <>
      <MoveablePanel
        isDocked={isDocked}
        setIsDocked={setIsDocked}
        isEnabled={configSettings.editorPanelEnabled || buildingService.configuration !== null}
      >
        <HeaderColumn
          title={
            selectedObject.object === "tower"
              ? "Tower Tools"
              : selectedObject.object === "plot"
              ? "Podium Tools"
              : "Site Tools"
          }
          description={"Double click to select objects in the scene"}
          isDocked={isDocked}
        />

        <ToolsColumn>
          <GeneralTools isDocked={isDocked} />

          <PodiumTools isDocked={isDocked} modalFunctions={modalFunctions} />
          <TowerTools isDocked={isDocked} modalFunctions={modalFunctions} />
        </ToolsColumn>

        <PanelDivider />

        <ToolsColumn>
          <SaveTools />
        </ToolsColumn>
        <PanelDivider />
        <MeasurementsTool isDocked={isDocked} />
      </MoveablePanel>
      <CustomModal
        title="Delete confirmation"
        description={modalDescription}
        handleClose={toggleModal}
        isOpen={modalIsOpen}
        buttons={[
          { text: "Yes", type: "secondary", onClick: handleConfirmation },
          { text: "No", type: "secondary", onClick: toggleModal }
        ]}
      />
    </>
  );
};
