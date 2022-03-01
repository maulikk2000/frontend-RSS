import { useEffect } from "react";
import { ScenarioList } from "pages/project/components/ScenarioList/ScenarioList";
import { LandingPage } from "pages/components/LandingPage/LandingPage";
import classes from "./ProjectPage.module.scss";
import { useScenarioStore } from "stores/scenarioStore";

const ProjectPage = () => {
  const [, scenarioActions] = useScenarioStore();

  useEffect(() => {
    scenarioActions.clearSelectedScenarios();
  }, []);

  return (
    <div className={classes.feasibilityWrapper}>
      <div className={classes.leftPanel}>
        <ScenarioList />
      </div>
      <div className={classes.mainPanel}>
        <LandingPage />
      </div>
    </div>
  );
};

export default ProjectPage;
