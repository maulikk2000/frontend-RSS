import { useRef, useMemo, useCallback } from "react";
import { Slider } from "@material-ui/core";

import classes from "./SunSlider.module.scss";
import "../SunSimulationPicker.scss";
import { getMinutesFromDate } from "pages/configurator/components/LoFiViewer/Sky/skyUtils";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";

type Props = {
  daySliderOpen: boolean;
};
export const SunSlider = ({ daySliderOpen }: Props) => {
  const minutesRef = useRef<number>(getMinutesFromDate(useRapidMutableStore.getState().skyDate));

  const minuteMarkersForSlider = useMemo(
    () => [
      { value: -360, label: "6am" },
      { value: -180, label: "9am" },
      { value: 0, label: "12pm" },
      { value: 180, label: "3pm" },
      { value: 360, label: "6pm" },
      { value: 560, label: "9pm" }
    ],
    []
  );

  const handleSunSimulationSlider = useCallback((value: number | number[]) => {
    const minutes = Array.isArray(value) ? value[0] : value;
    const newDate = new Date(useRapidMutableStore.getState().skyDate);

    // slider is calculated in minutes ONLY with noon as the zero point.
    newDate.setUTCHours(12, minutes);

    useRapidMutableStore.setState({ skyDate: newDate });

    minutesRef.current = minutes;
  }, []);

  return (
    <>
      {daySliderOpen && (
        <div className={classes.timeOfDay}>
          <div className={`${classes.toolModal} ${classes.slider} sunSimulation`}>
            <Slider
              defaultValue={getMinutesFromDate(useRapidMutableStore.getState().skyDate)}
              step={1}
              min={-360} // 720 mins (12 hrs) before noon (-360 = 6am)
              max={540} // 720 mins (12 hrs) past noon (540 = 9pm)
              onChange={(_, value) => {
                handleSunSimulationSlider(value);
              }}
              marks={minuteMarkersForSlider}
            />
          </div>
        </div>
      )}
    </>
  );
};
