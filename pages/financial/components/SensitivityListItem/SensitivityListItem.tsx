import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FC, useEffect, useState } from "react";
import Tag from "styling/components/Tag/Tag";
import { Sensitivity } from "types/financial";
import classes from "./SensitivityListtem.module.scss";

type SensitivityListItemProps = {
  sensitivity: Sensitivity;
  onDelete: (e, sensitivityId: string) => void;
  activeListItem: string;
  updateActiveListItem: (sensitivityId: string) => void;
  handleSelect: (sensitivity: Sensitivity) => void;
  handleChangeStatus: (e, sensitivityId: string) => void;
  handleChangeBaseLine: (e, sensitivityId: string) => void;
};

export const SensitivityListItem: FC<SensitivityListItemProps> = ({
  sensitivity,
  onDelete,
  activeListItem,
  updateActiveListItem,
  handleSelect,
  handleChangeStatus,
  handleChangeBaseLine
}) => {
  const [menuIsOpen, setmenuIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (sensitivity.id !== activeListItem) {
      setmenuIsOpen(false);
    }
  }, [activeListItem, sensitivity.id]);

  const handleMenuClick = (e) => {
    setmenuIsOpen(!menuIsOpen);
    updateActiveListItem(sensitivity.id);
    e.stopPropagation();
  };

  const handleClickAway = (e) => {
    setmenuIsOpen(false);
    e.stopPropagation();
  };

  return (
    <div className={classes.sensitivityListItem} key={sensitivity.id} onClick={() => handleSelect(sensitivity)}>
      <div className={classes.header}>
        <label>{sensitivity.name}</label>
        {sensitivity.isBaseLine && <label className={classes.baseline}>Baseline</label>}
      </div>
      <div className={classes.contentbody}>
        <div>IRR</div>
        <div>Area</div>
        <div>MOC</div>
        <div>Revenue</div>
        <div>Cost</div>
        <div className={classes.moreMenu} onClick={(e) => handleMenuClick(e)}>
          <MoreVertIcon className={`${classes.kebab} ${menuIsOpen ? classes.active : undefined}`} />
          {menuIsOpen && (
            <ClickAwayListener onClickAway={(e) => handleClickAway(e)}>
              <ul className={classes.optionList}>
                {!sensitivity.isBaseLine && (
                  <li onClick={(e) => handleChangeBaseLine(e, sensitivity.id)}>Set as Baseline</li>
                )}
                <li onClick={(e) => onDelete(e, sensitivity.id)}>Delete</li>
                <li onClick={(e) => handleChangeStatus(e, sensitivity.id)}>
                  Change Status to {sensitivity.status === "InProgress" ? "Completed" : "InProgress"}
                </li>
              </ul>
            </ClickAwayListener>
          )}
        </div>
      </div>
      <div className={classes.footer}>
        <Tag tag={sensitivity.status ?? ""} type={sensitivity.status?.replace(/\s/g, "") ?? ""} appearance={"dot"} />
        <label className={classes.modifiedDate}>Last Modified: 2 days ago</label>
      </div>
    </div>
  );
};
