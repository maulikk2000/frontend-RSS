import { useMessageBar } from "hooks/useSnackbarMessage";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useEffect, useState } from "react";
import { ReactComponent as SetbackRuler } from "styling/assets/icons/configurator/panelIcons/Setback.svg";
import shallow from "zustand/shallow";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";
import { HeaderColumn } from "../../MoveablePanel/HeaderColumn/HeaderColumn";
import { ToolsColumn } from "../../MoveablePanel/ToolsColumn/ToolsColumn";

type Props = {
  isDocked: boolean;
};
export const MeasurementsTool = ({ isDocked }: Props) => {
  const [configSettings] = useConfiguratorSettingsStore();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const showMessageBar = useMessageBar();

  const [configToolsMode, toggleConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.toggleMode],
    shallow
  );

  const toggleMeasurementTool = (e) => {
    e.stopPropagation();
    toggleConfigToolsMode("measure");
    if (!configSettings.is2D) {
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (snackbarOpen) {
      showMessageBar({ text: "Please enable 2D mode to use Setback Measurements", variant: "warning" });
      setSnackbarOpen(false);
    }
  }, [showMessageBar, snackbarOpen]);

  return (
    <>
      <HeaderColumn
        title={"Measure Setback"}
        description={"Select Ruler for accurate setback measurements"}
        isDocked={isDocked}
      />
      <ToolsColumn>
        <EditorTool
          title="Setback Ruler"
          selected={configToolsMode === "measure"}
          onClick={(e) => toggleMeasurementTool(e)}
          icon={<SetbackRuler />}
        />
      </ToolsColumn>
    </>
  );
};
