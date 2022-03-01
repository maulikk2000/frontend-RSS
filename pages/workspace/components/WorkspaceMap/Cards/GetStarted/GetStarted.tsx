import React, { FC, useEffect, useState } from "react";
import { Button } from "styling/components/Button/Button";
import { ReactComponent as CloseIcon } from "styling/assets/icons/close_icon.svg";
import classes from "./GetStarted.module.scss";
import { useMapStore } from "stores/mapStore";
import { Overlay } from "styling/components/Overlay/Overlay";
import mapimg from "./GetStarted.png";
import { Checkbox } from "styling/components/Checkbox/Checkbox";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";

interface Props {
  isDisplayed: boolean;
}

export const GetStarted: FC<Props> = ({ isDisplayed }) => {
  const [, mapActions] = useMapStore();
  const [dontShow, setDontShow] = useState<boolean>(false);

  const handleCancel = () => {
    mapActions.setShowGetStartedCard(false);
  };

  const handleCheck = () => {
    setDontShow(!dontShow);
  };

  const handleGotIt = () => {
    localStorageService.setLocalStorageItem({
      key: LocalStorgeKey.show_get_started,
      value: JSON.stringify(!dontShow)
    });
    handleCancel();
  };

  return (
    <>
      {isDisplayed && (
        <Overlay>
          <div className={classes.card}>
            <div className={classes.closeIcon} onClick={handleCancel}>
              <CloseIcon />
            </div>
            <h1 className={classes.heading}>Get Started!</h1>
            <label>Draw a new site on the map with the site editing tools.</label>
            <img src={mapimg} alt="" />
            <Checkbox checked={dontShow} onChange={handleCheck} label="Don’t show me again." />
            <Button classType="primary" className={classes.btn} onClick={handleGotIt}>
              Got It
            </Button>
          </div>
        </Overlay>
      )}
    </>
  );
};
