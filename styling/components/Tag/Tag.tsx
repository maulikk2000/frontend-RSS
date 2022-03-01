import React from "react";
import classes from "./Tag.module.scss";

interface TagProps {
  tag: string;
  type: string;
  appearance?: "dot" | "pill";
}

const Tag: React.FC<TagProps> = ({ tag, type, appearance = "pill" }) => {
  return (
    <>
      {appearance === "pill" && <div className={`${classes.tag} ${classes.pill} ${classes[type]}`}>{tag}</div>}

      {appearance === "dot" && (
        <div className={classes.dotWrapper}>
          <span className={`${classes.tag} ${classes[type]} ${classes.dot}`}></span>
          <span className={classes.tagName}>{tag.toLowerCase()}</span>
        </div>
      )}
    </>
  );
};

export default Tag;
