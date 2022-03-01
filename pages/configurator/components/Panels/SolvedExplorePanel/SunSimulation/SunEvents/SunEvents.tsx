import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { ReactComponent as EquinoxIcon } from "styling/assets/icons/configurator/solaranalysis_equinox_icon.svg";
import { ReactComponent as SummerSolsticeIcon } from "styling/assets/icons/configurator/solaranalysis_summersolstice_icon.svg";
import { ReactComponent as WinterSolsticeIcon } from "styling/assets/icons/configurator/solaranalysis_wintersolstice_icon.svg";
import "../SunSimulationPicker.scss";
import { useProjectStore } from "stores/projectStore";
import { getDateFromMinutes, getMinutesFromDate } from "pages/configurator/components/LoFiViewer/Sky/skyUtils";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { coordinate } from "pages/configurator/data/types";
import { EditorTool } from "../../../MoveablePanel/EditorTool/EditorTool";

type Props = {
  coordinates: coordinate;
  setSolarEvent: React.Dispatch<React.SetStateAction<string>>;
  solarEvent: string;
};
export const SunEvents = memo(({ coordinates, setSolarEvent, solarEvent }: Props) => {
  const YEAR = new Date().getFullYear().toString();
  const minutesRef = useRef<number>(getMinutesFromDate(useRapidMutableStore.getState().skyDate));

  const [projectStore] = useProjectStore();

  const [summerSolstice, setSummerSolstice] = useState(new Date(`12/21/${YEAR}`));
  const [winterSolstice, setWinterSolstice] = useState(new Date(`06/21/${YEAR}`));
  const [equinox, setEquinox] = useState(new Date(`03/20/${YEAR}`));

  const sunSimulatorControls = useMemo(
    () => [
      {
        value: "summerSolstice",
        label: "Summer Solstice",
        event: summerSolstice,
        icon: <SummerSolsticeIcon />
      },
      {
        value: "winterSolstice",
        label: "Winter Solstice",
        event: winterSolstice,
        icon: <WinterSolsticeIcon />
      },
      {
        value: "equinox",
        label: "Spring/Autumn Equinox",
        event: equinox,
        icon: <EquinoxIcon />
      }
    ],
    [summerSolstice, winterSolstice, equinox]
  );

  useEffect(() => {
    /**
     * if the longitude is less than 0, then we are in the
     * northern hemisphere, which means summer is in june and
     * winter in december.
     */
    if (coordinates[0] < 0) {
      setSummerSolstice(new Date(`06/21/${YEAR}`));
      setWinterSolstice(new Date(`12/21/${YEAR}`));
      setEquinox(new Date(`03/20/${YEAR}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectStore.selectedProjectId]);

  const handleRadioSelection = useCallback((value: string, date: Date) => {
    // deselecting a solar event that has already been selected
    // resets the day to todays date
    if (solarEvent === value) {
      const todaysDate = new Date().getUTCDate();
      const todaysMonth = new Date().getUTCMonth();
      const newDate = new Date();
      newDate.setUTCDate(todaysDate);
      newDate.setUTCMonth(todaysMonth);
      const time = getDateFromMinutes(minutesRef.current);
      newDate.setUTCMinutes(time.getUTCMinutes());
      newDate.setUTCHours(time.getUTCHours());

      useRapidMutableStore.setState({ skyDate: newDate });
      return setSolarEvent("");
    }

    setSolarEvent(value);
    date.setUTCHours(12, minutesRef.current);
    useRapidMutableStore.setState({ skyDate: date });
  }, []);

  return (
    <>
      {sunSimulatorControls.map((control, index) => (
        <React.Fragment key={index}>
          <EditorTool
            title={control.label}
            selected={solarEvent === control.value}
            icon={control.icon}
            onClick={() => handleRadioSelection(control.value, control.event)}
          />
        </React.Fragment>
      ))}
    </>
  );
});
