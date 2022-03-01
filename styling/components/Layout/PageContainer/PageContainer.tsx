import React from "react";
import classes from "./PageContainer.module.scss";

//NOTE: noHedaer is temporary until main layout is corected, req for labe page Jacinta.
interface PageContainerProps {
  noHeader?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, noHeader }) => {
  let classList = [classes.PageContainer];

  if (noHeader) {
    classList.push(classes.noHeader);
  }

  return <div className={classList.join(" ")}>{children}</div>;
};
