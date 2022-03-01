import { FC, useState, useEffect, useMemo, ReactNode } from "react";
import classes from "./Accordion.module.scss";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

export type accordionDisplayType = "block" | "flat" | "table";

export interface AccordionProps {
  display?: accordionDisplayType;
  header: ReactNode | string;
  headerRight?: ReactNode | string;
  isOpen?: boolean;
  isLastItem?: boolean;
  isFirstItem?: boolean;
  onClick?: () => void;
}

const Accordion: FC<AccordionProps> = (props) => {
  const { children, display = "block", header, headerRight, isOpen, isLastItem, isFirstItem, onClick } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setOpen(!open);
    onClick && onClick();
  };

  const memoizedContainerClasses = useMemo(() => {
    const classOpen = open ? classes.open : "";
    const classDisplay = classes[display];
    const classLastItem = isLastItem ? classes.lastItem : "";
    const classFirstItem = isFirstItem ? classes.firstItem : "";

    return `${classes.accordion} ${classDisplay} ${classLastItem} ${classFirstItem} ${classOpen}`;
  }, [display, isFirstItem, isLastItem, open]);

  const handleClick = () => {
    if (display !== "flat" || (display === "flat" && !open)) toggleOpen();
  };

  return (
    <>
      {display === "table" && (
        <div className={memoizedContainerClasses}>
          {!open && (
            <div className={classes.header} onClick={handleClick}>
              <h4>{header}</h4>
              <IconButton className={classes.icon} onClick={toggleOpen} aria-label="Expand">
                <ExpandMoreIcon />
              </IconButton>
            </div>
          )}

          {open && (
            <div className={classes.content}>
              <div className={classes.iconAbsolute} onClick={toggleOpen} aria-label="Collapse">
                <ExpandLessIcon onClick={toggleOpen} />
              </div>
              {children}
            </div>
          )}
        </div>
      )}

      {display !== "table" && (
        <div className={memoizedContainerClasses}>
          <div className={classes.header} onClick={handleClick}>
            <div className={classes.leftHeader}>
              <div>
                <h2>{header}</h2>
              </div>

              {!open && display === "block" ? (
                <div>
                  <h3 className={classes.rightHeader}>{headerRight}</h3>
                </div>
              ) : (
                display === "flat" &&
                open && (
                  <div className={classes.rightWrapper}>
                    <h3 className={classes.rightHeader}>{headerRight}</h3>
                  </div>
                )
              )}
            </div>
            <IconButton className={classes.icon} onClick={toggleOpen} aria-label={open ? "Collapse" : "Expand"}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
          {open && <div className={classes.content}>{children}</div>}
        </div>
      )}
    </>
  );
};

export default Accordion;
