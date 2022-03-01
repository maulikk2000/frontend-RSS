import { Save } from "@material-ui/icons";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";

export const SaveTools = () => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();

  const setConfigToolsMode = useConfiguratorToolsStore((state) => state.setMode);

  if (!buildingService.configuration) {
    return null;
  }

  const generateSite = async () => {
    setConfigToolsMode("none");
    await buildingServiceActions.createConfiguration();
    await buildingServiceActions.createFlow();
  };

  return <EditorTool title="Generate" selected={false} onClick={generateSite} icon={<Save />} />;
};
