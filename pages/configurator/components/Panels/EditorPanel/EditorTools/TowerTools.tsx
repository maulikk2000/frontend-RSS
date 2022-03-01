import { Cancel, Create, Delete } from "@material-ui/icons";
import { ReactComponent as BarIcon } from "styling/assets/icons/configurator/Bar.svg";
import { ReactComponent as LShapeIcon } from "styling/assets/icons/configurator/L-Shape.svg";
import { ReactComponent as FootprintIcon } from "styling/assets/icons/configurator/panelIcons/Footprint.svg";

import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getSelectedObject, isObjectSelected } from "pages/configurator/utilities/configurationUtils";
import { DropdownTool } from "../../MoveablePanel/DropdownTool/DropdownTool";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";
import { PanelTip } from "../../MoveablePanel/PanelTip/PanelTip";
import { AddObjectDrawTip, RemoveTowerTip, TowerDrawTip } from "../../MoveablePanel/PanelTip/constants";
import { useEffect, useState } from "react";
import { ModalFunctionType } from "./types";
import shallow from "zustand/shallow";
import { useSelectedPlot } from "pages/configurator/stores/buildingServiceStoreSelectors";

type Props = {
  isDocked: boolean;
  modalFunctions: ModalFunctionType;
};
export const TowerTools = ({ isDocked, modalFunctions }: Props) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [selectedPlot] = useSelectedPlot();

  const [configToolsMode, setConfigToolsMode, toggleConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode, state.toggleMode],
    shallow
  );

  const [typology, setTypology] = useState<boolean>(false);

  const selectedObject = getSelectedObject(buildingService);
  const isTowerSelected = isObjectSelected(buildingService, "tower");

  const handleDeleteKeyPress = (event) => {
    if (event.key === "Delete" && isTowerSelected) {
      removeTower();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleDeleteKeyPress);
    return () => {
      document.removeEventListener("keydown", handleDeleteKeyPress);
    };
    // need to add buildingService as deps here so handlePressDelete can get up to date value
  }, [buildingService]);

  if (!isTowerSelected || selectedObject.index === null) {
    return null;
  }

  const tower = selectedPlot?.towers[selectedObject.index];

  if (!tower) {
    return null;
  }

  const typologyDropdown: JSX.Element[] = [
    <EditorTool
      title="Bar"
      selected={tower.buildingTypology === "Bar"}
      onClick={() => buildingServiceActions.setBuildingTypology("Bar")}
      icon={<BarIcon />}
    />,
    <EditorTool
      title="L-Shape"
      onClick={() => buildingServiceActions.setBuildingTypology("LShape")}
      selected={tower.buildingTypology === "LShape"}
      icon={<LShapeIcon />}
    />
  ];

  const deleteTower = () => {
    setConfigToolsMode("none");
    const towers = [...selectedPlot!.towers];
    towers.splice(selectedObject.index!, 1);
    buildingServiceActions.setSelectedObjectIndex(
      towers.length ? "tower" : "plot",
      0,
      buildingService.selectedPlotIndex
    );
    buildingServiceActions.updatePlotTowers(towers);
  };

  const removeTower = () => {
    let confirm = false;

    if (configToolsMode === "add") {
      confirm = true;
    } else {
      modalFunctions.setModalDescription(
        `Are you sure you want to remove Plot ${selectedPlot!.label}, Tower ${selectedObject.index! + 1}`
      );
      modalFunctions.toggleModal();
      modalFunctions.setConfirmCallback(() => deleteTower);
    }
    if (confirm) {
      deleteTower();
    }
  };

  return (
    <>
      <DropdownTool
        title="Typology"
        selected={typology}
        onClick={() => {
          setTypology(!typology);
        }}
        icon={<BarIcon />}
        selection={typologyDropdown}
        docked={isDocked}
      />
      <PanelTip
        tip={configToolsMode === "add" ? AddObjectDrawTip : TowerDrawTip}
        enabled={configToolsMode === "draw" || configToolsMode === "add"}
        alwaysDisplayed={configToolsMode === "add"}
      >
        <EditorTool
          title="Draw"
          selected={configToolsMode === "draw"}
          onClick={() => toggleConfigToolsMode("draw")}
          icon={configToolsMode === "draw" ? <Cancel /> : <Create />}
        />
      </PanelTip>
      <EditorTool
        title="Edit"
        selected={configToolsMode === "edit"}
        onClick={() => toggleConfigToolsMode("edit")}
        icon={<FootprintIcon />}
      />
      <PanelTip tip={RemoveTowerTip} enabled>
        <EditorTool title="Tower" selected={false} onClick={removeTower} icon={<Delete />} />
      </PanelTip>
    </>
  );
};
