import React, { FC } from "react";
import { ReactComponent as AddIcon } from "styling/assets/icons/plusIcon.svg";
import { useMapStore } from "stores/mapStore";
import SiteDetailCard, { DetailCardToggleProps } from "./SiteDetailCard";
import classes from "./SiteDetail.module.scss";

export const SiteDetailNewMode: FC<DetailCardToggleProps> = ({ show }) => {
  const [, { setShowSiteDetailModal, setShowCreateProjectModal }] = useMapStore();

  const createProjectFromSite = () => {
    setShowSiteDetailModal(false);
    setShowCreateProjectModal(true);
  };

  return (
    <SiteDetailCard
      title={"New Site"}
      description={"Start developing scenarios on this site"}
      onClick={createProjectFromSite}
      btnText={"Create Project"}
      analyticsId={"CreateProjectFromCustomSite"}
      icon={<AddIcon className={classes.icon} />}
      show={show}
    />
  );
};

export default SiteDetailNewMode;
