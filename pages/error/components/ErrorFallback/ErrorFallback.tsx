import React from "react";
import { FallbackProps } from "react-error-boundary";
import { HomeLink } from "../RedirectLinks/HomeLink";
import { PageContainer } from "styling/components/Layout/PageContainer/PageContainer";
import classes from "../../ErrorPage.module.scss";

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <PageContainer>
      <div className={classes.ErrorPage}>
        <h1>Something went wrong!</h1>
        <div>Please try going back to the previous page or return to home page.</div>
        <div className={classes.redirectHome}>
          <HomeLink />
        </div>
      </div>
    </PageContainer>
  );
};

export default ErrorFallback;
