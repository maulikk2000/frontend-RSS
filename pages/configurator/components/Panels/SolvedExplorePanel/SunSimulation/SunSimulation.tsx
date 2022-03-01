import { useState } from "react";
import { ReactComponent as DaySliderIcon } from "styling/assets/icons/configurator/panelIcons/DaySlider.svg";
import { ReactComponent as TimeAnimateIcon } from "styling/assets/icons/configurator/panelIcons/Animate.svg";

import "./SunSimulationPicker.scss";
import { useSelectedProject } from "stores/projectStore";
import { coordinate } from "pages/configurator/data/types";
import { HeaderColumn } from "../../MoveablePanel/HeaderColumn/HeaderColumn";
import { ToolsColumn } from "../../MoveablePanel/ToolsColumn/ToolsColumn";
import { EditorTool } from "../../MoveablePanel/EditorTool/EditorTool";
import { PanelDivider } from "../../MoveablePanel/PanelDivider/PanelDivider";
import { SunSlider } from "./SunSlider/SunSlider";
import { SunAnimation } from "./SunAnimation/SunAnimation";
import { SunDatePicker } from "./SunDatePicker/SunDatePicker";
import { SunEvents } from "./SunEvents/SunEvents";

type Props = {
  isDocked: boolean;
};
export const SunSimulation = ({ isDocked }: Props) => {
  const [daySliderOpen, setDaySliderOpen] = useState(false);
  const [timeAnimationOpen, setTimeAnimationOpen] = useState(false);

  const [selectedProject] = useSelectedProject();

  /**
   * If the user decides to use the date time picker after having selected
   * a radio solar event, this will deselected the selected solar event.
   */
  const [solarEvent, setSolarEvent] = useState<string>("");

  let coordinates: coordinate | undefined = selectedProject?.siteWorldCoordinates;

  if (!(coordinates instanceof Array)) {
    return null;
  }

  return (
    <>
      <HeaderColumn
        title={"Shadow Analysis"}
        description={"Select Time of Year or Time of Day for Shadow Analysis"}
        isDocked={isDocked}
      />
      <ToolsColumn>
        <SunEvents coordinates={coordinates} setSolarEvent={setSolarEvent} solarEvent={solarEvent} />

        <SunDatePicker setSolarEvent={setSolarEvent} />
      </ToolsColumn>

      <PanelDivider />

      <ToolsColumn>
        <SunSlider daySliderOpen={daySliderOpen} />
        <EditorTool
          title={"Day Slider"}
          selected={daySliderOpen}
          icon={<DaySliderIcon />}
          onClick={() => setDaySliderOpen(!daySliderOpen)}
        />

        <SunAnimation timeAnimationOpen={timeAnimationOpen} />
        <EditorTool
          title={"Time Animate"}
          selected={timeAnimationOpen}
          icon={<TimeAnimateIcon />}
          onClick={() => setTimeAnimationOpen(!timeAnimationOpen)}
        />
      </ToolsColumn>
    </>
  );
};
