import { Cancel, Create, Delete } from "@material-ui/icons";
import { ReactComponent as FootprintIcon } from "styling/assets/icons/configurator/panelIcons/Footprint.svg";

import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getSelectedObject, isObjectSelected } from "pages/configurator/utilities/configurationUtils";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";

import { AddObjectDrawTip, DrawTip, RemovePlotTip } from "../../MoveablePanel/PanelTip/constants";
import { PanelTip } from "../../MoveablePanel/PanelTip/PanelTip";
import { ModalFunctionType } from "./types";
import shallow from "zustand/shallow";
import { useSelectedPlot } from "pages/configurator/stores/buildingServiceStoreSelectors";

type Props = {
  isDocked: boolean;
  modalFunctions: ModalFunctionType;
};
export const PodiumTools = ({ isDocked, modalFunctions }: Props) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [selectedPlot] = useSelectedPlot();

  const [configToolsMode, setConfigToolsMode, toggleConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode, state.toggleMode],
    shallow
  );

  const plots = buildingService.configuration!.plots;

  const selectedObject = getSelectedObject(buildingService);
  const isPodiumSelected = isObjectSelected(buildingService, "podium") || isObjectSelected(buildingService, "plot");

  const deletePlot = () => {
    const updatedPlots = [...plots];

    updatedPlots.splice(selectedObject.plotIndex!, 1);
    buildingServiceActions.setSelectedObjectIndex(null, null, 0);
    buildingServiceActions.updatePlots(updatedPlots);

    setConfigToolsMode("none");
  };

  const removePlot = () => {
    let confirm = false;

    if (configToolsMode === "add") {
      confirm = true;
    } else {
      modalFunctions.setModalDescription(
        `Are you sure you want to remove Plot ${selectedPlot?.label}? This will delete the towers as well.`
      );
      modalFunctions.toggleModal();
      modalFunctions.setConfirmCallback(() => deletePlot);
    }
    if (confirm) {
      deletePlot();
    }
  };

  if (!isPodiumSelected || selectedObject.index === null) {
    return null;
  }

  return (
    <>
      <PanelTip
        tip={configToolsMode === "add" ? AddObjectDrawTip : DrawTip}
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

      <PanelTip tip={RemovePlotTip} enabled>
        <EditorTool title="Plot" selected={false} onClick={removePlot} icon={<Delete />} />
      </PanelTip>
    </>
  );
};
