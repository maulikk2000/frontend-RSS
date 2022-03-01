import React from "react";
import { PageContainer } from "styling/components/Layout/PageContainer/PageContainer";
import classes from "../../ErrorPage.module.scss";
import { HomeLink } from "../RedirectLinks/HomeLink";

const NotFound404Page = () => {
  return (
    <>
      <PageContainer>
        <div className={classes.ErrorPage}>
          <h1>404 - Page Not Found</h1>
          <div>
            Uh oh, we cannot seem to find the page you are looking for (
            <span className={classes.urlPath}>{window.location.href}</span>).
          </div>
          <div>Please try going back to the previous page or return to home page.</div>
          <div className={classes.redirectHome}>
            <HomeLink />
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default NotFound404Page;
