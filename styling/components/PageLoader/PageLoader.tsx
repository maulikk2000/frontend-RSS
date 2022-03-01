import React, { PropsWithChildren } from "react";
import { LoadStatus } from "./LoadStatus";
import classes from "./PageLoader.module.scss";

export type PageLoaderProps = {
  title?: string;
};

export const PageLoader = ({ title, children }: PropsWithChildren<PageLoaderProps>) => {
  return (
    <>
      <div className={classes.overlay}></div>
      <div className={classes.loader}>
        <div className={classes.loader_content}>
          <div className={classes.loader_inner}>
            <LoadStatus title={title} />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
