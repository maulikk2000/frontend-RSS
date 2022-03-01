import { LeftSidebar } from "pages/scenario/components/LeftSidebar/LeftSidebar";
import { ObjectReferences } from "pages/configurator/components/LoFiViewer/ObjectReferences/ObjectReferences";
import { ConfigurationSolverLoader } from "pages/configurator/components/Loader/ConfigurationSolverLoader";
import { EastWhismanViewer } from "pages/scenario/components/EastWhismanViewer/EastWhismanViewer";
import classes from "./ScenarioPage.module.scss";

const ScenarioPage = () => {
  return (
    <>
      <ObjectReferences />
      <div className={classes.feasibilityWrapper}>
        <div className={classes.leftPanel}>
          <LeftSidebar />
        </div>
        <div className={classes.mainPanel}>
          <EastWhismanViewer />
        </div>
      </div>
      <ConfigurationSolverLoader />
    </>
  );
};

export default ScenarioPage;
