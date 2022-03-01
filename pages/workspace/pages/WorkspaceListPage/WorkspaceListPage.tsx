import classes from "./WorkspaceListPage.module.scss";
import { LandingPage as RightSideBarContent } from "../../../components/LandingPage/LandingPage";
import { WorkspaceList } from "./WorkspaceList/WorkspaceList";
import { useEffect } from "react";
import { useProjectStore } from "stores/projectStore";
import { useScenarioStore } from "stores/scenarioStore";

const WorkspaceListPage = () => {
  const [, projectActions] = useProjectStore();
  const [, scenarioActions] = useScenarioStore();

  useEffect(() => {
    projectActions.resetProjectStore();
    scenarioActions.resetScenarioStore();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        <WorkspaceList />
      </div>
      <div className={classes.mainPanel}>
        <RightSideBarContent title={`Welcome to Podium`} />
      </div>
    </div>
  );
};

export default WorkspaceListPage;
