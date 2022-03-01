import { useState } from "react";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import classes from "./Metrics.module.scss";
import { PlotMetrics } from "./PlotMetrics";
import { ScenarioMetrics } from "./ScenarioMetrics";
import { TowerMetrics } from "./TowerMetrics";
import { ScenarioDetails } from "../ScenarioDetails/ScenarioDetails";
import { BackToProjectLink } from "../BackToProjectLink/BackToProjectLink";
import { SiteTabs, Tab } from "../SiteTabs/SiteTabs";
import { ReactComponent as EditIcon } from "styling/assets/icons/editBuilding.svg";
import { useScenarioStore, useSelectedScenarios } from "stores/scenarioStore";
import CsvButton from "../../../../styling/components/CsvButton/CsvButton";
import { ScenarioPhase } from "types/scenario";
import { CustomModal } from "styling/components/Modal/CustomModal";

export const Metrics = () => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [, scenarioActions] = useScenarioStore();
  const [selectedTab, setTab] = useState<Tab>("scenario");
  const [exportData, setExportData] = useState<string[][]>([[]]);
  const [csvFileName, setCsvFileName] = useState<string>("empty");
  const selectedObject = getSelectedObject(buildingService);
  const [selectedScenarios] = useSelectedScenarios();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleConfirm = () => {
    buildingServiceActions.clearSolvedBuilding();
    const scenario = selectedScenarios.length > 0 ? selectedScenarios[0] : null;
    if (scenario) {
      scenario.phase = ScenarioPhase.Draft;
      scenarioActions.updateScenario(scenario);
    }
  };

  const selectedTower = buildingService.building!.plots[selectedObject.plotIndex ?? buildingService.selectedPlotIndex]
    .building.towers[selectedObject.index ?? buildingService.selectedObjectIndex ?? 0];
  return (
    <div className={classes.metricWrapper}>
      <div className={classes.backButton}>
        <BackToProjectLink />
      </div>
      <ScenarioDetails />
      <SiteTabs tabs={["scenario", "plot", "tower"]} setTab={setTab} selectedTab={selectedTab}>
        <div className={classes.tabDisplay}>
          {selectedTab === "scenario" && (
            <ScenarioMetrics
              siteMetrics={buildingService.building!.siteMetrics}
              setExportData={setExportData}
              setCsvFileName={setCsvFileName}
            />
          )}
          {selectedTab === "plot" && (
            <PlotMetrics
              solvedPlot={
                buildingService.building!.plots[selectedObject.plotIndex ?? buildingService.selectedPlotIndex]
              }
              setExportData={setExportData}
              setCsvFileName={setCsvFileName}
            />
          )}
          {selectedTab === "tower" && selectedTower && (
            <TowerMetrics
              tower={selectedTower}
              selectedPlot={
                buildingService.building!.plots[selectedObject.plotIndex ?? buildingService.selectedPlotIndex].label
              }
              index={selectedObject.index ?? buildingService.selectedObjectIndex ?? 0}
              setExportData={setExportData}
              setCsvFileName={setCsvFileName}
            />
          )}
        </div>
      </SiteTabs>
      <div className={classes.buttonPanel}>
        <div>
          <CsvButton data={exportData} filename={csvFileName} />
        </div>
        <button onClick={() => toggleModal()} className={classes.editButton}>
          Edit Building
          <EditIcon className={classes.editIcon} />
        </button>
      </div>
      <CustomModal
        description="Are you sure you want to edit? Editing will require you to solve the building again."
        handleClose={toggleModal}
        isOpen={modalIsOpen}
        buttons={[
          { text: "Yes", type: "secondary", onClick: handleConfirm },
          { text: "No", type: "secondary", onClick: toggleModal }
        ]}
      />
    </div>
  );
};
