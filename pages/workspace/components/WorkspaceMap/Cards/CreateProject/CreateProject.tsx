import React, { FC, useEffect, useState } from "react";
import { Button } from "styling/components/Button/Button";
import { TextField } from "styling/components/TextField/TextField";
import { ReactComponent as CloseIcon } from "styling/assets/icons/close_icon.svg";
import classes from "./CreateProject.module.scss";
import { useProjectStore } from "stores/projectStore";
import { CreateProjectRequest } from "types/project";
import { Feature } from "geojson";
import { useHistory } from "react-router-dom";
import { getRoute } from "routes/utils";
import { RouteArgs, RouteName } from "routes/types";
import { Overlay } from "styling/components/Overlay/Overlay";
import { useMapStore } from "stores/mapStore";
import IconButton from "@material-ui/core/IconButton";
import { useAnalytics } from "utils/analytics";

interface Props {
  isDisplayed: boolean;
  workspace: { id: string; name: string };
  selectedSite: Feature | undefined;
}

type ClientErrCreateProject = {
  name: string;
};

export const CreateProject: FC<Props> = ({ isDisplayed, workspace, selectedSite }) => {
  const [projectStore, projectActions] = useProjectStore();
  const [{ drawLayerStatus }, mapActions] = useMapStore();
  const [projectName, setProjectName] = useState<string>();
  const [clientErr, setClientErr] = useState<ClientErrCreateProject>({
    name: ""
  });
  const history = useHistory();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!workspace || !selectedSite) {
      return;
    }
  }, [workspace, selectedSite]);

  useEffect(() => {
    if (projectStore.selectedProjectId && drawLayerStatus === "saved") {
      const pathArgs: RouteArgs = {
        selectedWorkSpaceName: workspace.name
      };
      const workspaceRoute = getRoute(RouteName.Workspace);
      history.push(workspaceRoute.getNavPath!(pathArgs));
    }
  }, [history, projectStore.selectedProjectId, workspace.name, drawLayerStatus]);

  const handleButtonClick = async () => {
    if (projectName == null) {
      setClientErr({ name: "Please enter a name" });
      return;
    }

    const projectRequest: CreateProjectRequest = {
      name: projectName,
      address: "",
      city: "",
      state: "",
      authority: "",
      zoningDistrict: "",
      zoningLandUse: "",
      heightLimit: "",
      farLimit: "",
      siteArea: "",
      lead: "",
      coordinates: selectedSite?.geometry["coordinates"][0],
      description: ""
    };

    // Hard-coded "custom" here because we can only create projects from custom parcels atm
    trackEvent("project_create", {
      workspace_name: workspace.name,
      parcel_type: "custom"
    });

    await projectActions.createProject(workspace.id, projectRequest);
    mapActions.setDrawLayerStatus("saved");

    mapActions.setShowCreateProjectModal(false);
  };

  const handleChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleCancel = () => {
    mapActions.setShowCreateProjectModal(false);
  };

  const resetErr = () => {
    setClientErr({ name: "" });
  };

  return (
    <>
      {isDisplayed && (
        <Overlay>
          <div className={classes.card}>
            <div className={classes.heading}>
              <h1 className={classes.btnTxt}>Create a New Project</h1>
              <IconButton className={classes.closeButton} aria-label="Close" onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </div>
            <label>Enter a unique name for your project.</label>
            {clientErr.name && (
              <label className="error">
                <br />
                {clientErr.name}
              </label>
            )}
            <TextField className={classes.textFiled} onChange={handleChange} value={projectName} onFocus={resetErr} />
            <p className="lowlight">By default this will be set as your baseline scenario.</p>
            <div className={classes.btnWrapper}>
              <Button classType="primary" onClick={handleButtonClick}>
                confirm
              </Button>
              <Button classType="secondary" onClick={handleCancel}>
                cancel
              </Button>
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
};
