import classes from "./NoApplicationAccessPage.module.scss";
import { PageContainer } from "styling/components/Layout/PageContainer/PageContainer";

const NoApplicationAccessPage = () => {
  return (
    <>
      <PageContainer>
        <div className={classes.container}>
          <h1>Thanks for trying to access Podium Envision!</h1>
          <p>Unfortunately we can't let you in just yet as you do not have access to any workspaces.</p>
          <p>The Podium team have been notified of your request and will be in touch with more details shortly.</p>
        </div>
      </PageContainer>
    </>
  );
};

export default NoApplicationAccessPage;
