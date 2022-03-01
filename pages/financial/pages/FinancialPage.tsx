import { LandingPage as RightSideBarContent } from "pages/components/LandingPage/LandingPage";
import { useState } from "react";
import { Sensitivity } from "types/financial";
import { FinancialFrame } from "../components/FinancialFrame/FinancialFrame";
import { SensitivityList } from "../components/SensitivityList/SensitivityList";
import classes from "../pages/FinancialPage.module.scss";

const FinancialPage = () => {
  const initialState: Sensitivity = { id: "", name: "", scenarioId: "" };
  const [selectedSensitivity, setSelectedSensitivity] = useState(initialState);

  const updateSensitivity = (sensitivity: Sensitivity) => {
    setSelectedSensitivity(sensitivity);
  };

  return (
    <div className={classes.feasibilityWrapper}>
      <div className={classes.leftPanel}>
        <SensitivityList updateSensitivity={updateSensitivity} />
      </div>
      <div className={classes.mainPanel}>
        {selectedSensitivity.id ? <FinancialFrame sensitivityId={selectedSensitivity.id} /> : <RightSideBarContent />}
      </div>
    </div>
  );
};

export default FinancialPage;
