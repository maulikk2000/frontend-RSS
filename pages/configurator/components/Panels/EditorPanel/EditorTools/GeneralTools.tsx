import { useState } from "react";
import { Add, Crop169 } from "@material-ui/icons";
import { ConfiguratorAddObjectType, useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";
import { PanelTip } from "../../MoveablePanel/PanelTip/PanelTip";
import { AddObjectTip } from "../../MoveablePanel/PanelTip/constants";
import { ReactComponent as BarIcon } from "styling/assets/icons/configurator/Bar.svg";
import { ReactComponent as LShapeIcon } from "styling/assets/icons/configurator/L-Shape.svg";
import { DropdownTool } from "../../MoveablePanel/DropdownTool/DropdownTool";
import shallow from "zustand/shallow";

type Props = {
  isDocked: boolean;
};
export const GeneralTools = ({ isDocked }: Props) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [isAddingObject, setIsAddingObject] = useState(false);
  const plots = buildingService.configuration!.plots;

  const [setConfigToolsMode, setAddObjectType] = useConfiguratorToolsStore(
    (state) => [state.setMode, state.setAddObjectType],
    shallow
  );

  const towerTypologies = [
    { typology: "Bar", icon: <BarIcon style={{ width: 25 }} /> },
    { typology: "LShape", icon: <LShapeIcon style={{ width: 25 }} /> }
  ];

  const addObject = (object: ConfiguratorAddObjectType) => {
    setAddObjectType(object);
    setConfigToolsMode("add");
    buildingServiceActions.clearSelectedObject();
    setIsAddingObject(false);
  };

  const addObjectArray: JSX.Element[] = [];

  addObjectArray.push(
    <EditorTool title={"Podium"} selected={false} onClick={() => addObject("Podium")} icon={<Crop169 />} />
  );

  if (plots.length > 0) {
    towerTypologies.forEach((typology) => {
      addObjectArray.push(
        <EditorTool
          title={typology.typology}
          selected={false}
          onClick={() => addObject(typology.typology as ConfiguratorAddObjectType)}
          icon={typology.icon}
        />
      );
    });
  }

  return (
    <>
      <PanelTip tip={AddObjectTip} enabled={!isAddingObject}>
        <DropdownTool
          title="Objects"
          selected={isAddingObject}
          onClick={() => {
            setIsAddingObject(!isAddingObject);
          }}
          icon={<Add />}
          selection={addObjectArray}
          docked={isDocked}
        />
      </PanelTip>
    </>
  );
};
