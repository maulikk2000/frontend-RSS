import React, { useState, useRef, useCallback, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { ReactComponent as DateIcon } from "styling/assets/icons/configurator/panelIcons/Date.svg";
import "../SunSimulationPicker.scss";
import { getMinutesFromDate } from "pages/configurator/components/LoFiViewer/Sky/skyUtils";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { EditorTool } from "../../../MoveablePanel/EditorTool/EditorTool";
import { throttle } from "lodash-es";

type Props = {
  setSolarEvent: React.Dispatch<React.SetStateAction<string>>;
};
export const SunDatePicker = ({ setSolarEvent }: Props) => {
  const minutesRef = useRef<number>(getMinutesFromDate(useRapidMutableStore.getState().skyDate));
  const [dateEditorSelected, setDateEditorSelected] = useState(false);
  const [displayedDate, setDisplayedDate] = useState(useRapidMutableStore.getState().skyDate);

  useEffect(() => {
    // The RapidMutableStore is updating at 60fps. Subscribe directly to
    // throttle the number of state updates in this component.
    return useRapidMutableStore.subscribe(
      throttle(() => {
        setDisplayedDate(useRapidMutableStore.getState().skyDate);
      }, 500)
    );
  }, []);

  const handleDateTimePicker = useCallback((date: Date | null) => {
    if (!date) return;

    setSolarEvent("");
    date.setUTCHours(12, minutesRef.current);
    useRapidMutableStore.setState({ skyDate: date });
  }, []);

  return (
    <>
      <div className={"sunSimulation"}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <EditorTool
            title={"Custom Date"}
            selected={dateEditorSelected}
            icon={
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                keyboardIcon={<DateIcon />}
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                value={displayedDate}
                onChange={(date) => handleDateTimePicker(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
                onClick={() => setDateEditorSelected(true)}
                onClose={() => setDateEditorSelected(false)}
              />
            }
          />
        </MuiPickersUtilsProvider>
      </div>
    </>
  );
};
