import React from "react";
import classes from "./MassingEditorWorkflowCard.module.scss";
import { ReactComponent as EditMassingWorkflow } from "styling/assets/icons/edit_Massing_Workflow_Icon.svg";
import { ReactComponent as MassingWorkflowStepComplete } from "styling/assets/icons/massing_Workflow_Step_Complete_Icon.svg";

export interface MassingEditorWorkflowCardProps {
  stepNumber: number;
  isCompleted: boolean;
  headerTextLeft: string;
  isExpanded: boolean;
  isEnabled: boolean;
  headerTextRight: string;
  description: string;
  component?: React.ReactNode;
  onToggle: (stepNumber) => void;
}

const MassingEditorWorkflowCard: React.FC<MassingEditorWorkflowCardProps> = ({
  stepNumber,
  isCompleted,
  headerTextLeft,
  isExpanded,
  headerTextRight,
  description,
  component,
  isEnabled,
  onToggle
}) => {
  const isTransparent = !isCompleted && !isExpanded;
  return (
    <div className={`${classes.mainContainer} ${isTransparent ? classes.transparent : ""}`}>
      {isExpanded ? (
        <React.Fragment>
          <div className={`${classes.container} ${classes.expanded}`}>
            <div className={classes.leftContainer}>
              <div className={classes.massingStepHeading}>{headerTextLeft}</div>
            </div>
            <div className={classes.rightContainer}>
              <div>{headerTextRight}</div>
            </div>
          </div>
          <div className={classes.description}>{description}</div>
          <div>{component}</div>
        </React.Fragment>
      ) : (
        <div className={classes.container}>
          <div className={classes.leftContainer}>
            <div className={classes.iconMarginRight}>{isCompleted && <MassingWorkflowStepComplete />}</div>
            <div className={`${classes.massingStepHeading} ${classes.inactive}`}>{headerTextLeft}</div>
          </div>

          <div className={classes.rightContainer}>
            {isEnabled && (
              <div onClick={() => onToggle(stepNumber)} className={classes.iconMarginRight}>
                <EditMassingWorkflow />
              </div>
            )}
            <div className={classes.inactive}>{headerTextRight}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassingEditorWorkflowCard;
