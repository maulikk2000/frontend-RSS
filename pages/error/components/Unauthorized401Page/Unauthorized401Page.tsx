import React from "react";
import classes from "../../ErrorPage.module.scss";
import { PageContainer } from "styling/components/Layout/PageContainer/PageContainer";
import { HomeLink } from "../RedirectLinks/HomeLink";

const Unauthorized401Page = () => {
  return (
    <>
      <PageContainer>
        <div className={classes.ErrorPage}>
          <h1>401 - Unauthorized: Access is denied</h1>
          <div>
            You do not have permission to view this directory or page using the credentials that you supplied. Please
            contact your administrator for further information.
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

export default Unauthorized401Page;
