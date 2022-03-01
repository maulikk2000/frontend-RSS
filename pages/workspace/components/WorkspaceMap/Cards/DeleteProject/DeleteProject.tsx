import React, { FC } from "react";
import { Button } from "styling/components/Button/Button";
import { ReactComponent as CloseIcon } from "styling/assets/icons/close_icon.svg";
import classes from "./DeleteProject.module.scss";
import { useProjectStore } from "stores/projectStore";
import { Project } from "types/project";
import { Overlay } from "styling/components/Overlay/Overlay";
import { useMapStore } from "stores/mapStore";
import IconButton from "@material-ui/core/IconButton";

interface Props {
  isDisplayed: boolean;
  project: Project;
}

export const DeleteProject: FC<Props> = ({ isDisplayed, project }) => {
  const [, projectActions] = useProjectStore();
  const [, mapActions] = useMapStore();

  const handleDelete = () => {
    projectActions.deleteProject(project.id);
    mapActions.setShowDeleteProjectModal(false);
  };

  const handleCancel = () => {
    mapActions.setShowDeleteProjectModal(false);
  };

  return (
    <>
      {isDisplayed && (
        <Overlay>
          <div className={classes.card}>
            <div className={classes.heading}>
              <h1 className={classes.btnTxt}>Delete Project</h1>
              <IconButton className={classes.closeButton} aria-label="Close" onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </div>
            <label>Are you sure you want to delete your project?</label>
            <h3>{project.name}</h3>
            <p className="lowlight">Once you delete the project you cannot undo.</p>
            <div className={classes.btnWrapper}>
              <Button classType="primary" onClick={handleDelete}>
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
