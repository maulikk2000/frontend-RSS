import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { useFrame } from "react-three-fiber";

type Props = {
  minutesPerMS: number;
};

export const SkyAnimation = ({ minutesPerMS }: Props) => {
  useFrame(() => {
    let newDate = new Date(useRapidMutableStore.getState().skyDate.getTime() + minutesPerMS * 60000);

    if (newDate.getHours() < 6) {
      // 6am
      newDate.setHours(5);
    }
    if (newDate.getHours() > 21) {
      // 9pm
      newDate.setHours(5);
    }

    useRapidMutableStore.setState({ skyDate: newDate });
  });

  return <></>;
};
