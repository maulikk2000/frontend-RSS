import { Edit } from "@material-ui/icons";
import React, { ReactNode, useState } from "react";
import { Html } from "../../../Common/HtmlMarkers/Html";
import classes from "./SiteNoteLabel.module.scss";

type Props = {
  clickThrough: boolean;
  isEdit?: boolean;
  distance?: string;
  label?: string;
  setIsEdit?: (bool: boolean) => void;
  handleSubmit?: (label: string) => void;
  children?: ReactNode;
};

export const SiteNoteLabel = ({ isEdit, distance, label, setIsEdit, handleSubmit, clickThrough, children }: Props) => {
  const [labelText, setLabelText] = useState<string>(label ? label : "");

  const handleChange = (event) => {
    setLabelText(event?.target.value);
  };

  const BaseLabel = () => {
    return (
      <>
        <div className={classes.labelHeader}>
          {distance}
          <button
            onClick={(e) => {
              setIsEdit!(true);
              setLabelText!("");
            }}
            className={classes.editButton}
          >
            <Edit className={classes.editIcon} fontSize={"small"} />
          </button>
        </div>
        {labelText ? <div className={classes.labelText}>{labelText}</div> : <></>}
      </>
    );
  };

  const EditLabel = () => {
    return (
      <>
        <div className={classes.labelHeader}>{distance}</div>
        <label>
          <input
            className={classes.inputField}
            autoFocus
            type="text"
            value={labelText}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button className={classes.submitButton} onClick={() => handleSubmit!(labelText)}>
          OK
        </button>
      </>
    );
  };

  return (
    <Html style={clickThrough ? { pointerEvents: "none" } : {}} center>
      <div className={`${classes.container} ${classes["primary"]}`}>
        <h2 className={classes.inner}>{children ? children : isEdit ? <EditLabel /> : <BaseLabel />}</h2>
      </div>
    </Html>
  );
};
