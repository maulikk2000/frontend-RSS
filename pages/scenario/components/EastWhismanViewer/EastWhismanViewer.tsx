import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LoFiViewer } from "pages/configurator/components/LoFiViewer/LoFiViewer";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useSelectedScenarios } from "stores/scenarioStore";
import { ComplianceModal } from "../../../compliance/components/ComplianceModal/ComplianceModal";
import { ScenarioFinancialsModal } from "pages/financial/components/ScenarioFinancialsModal/ScenarioFinancialsModal";
import { SaveIcon } from "../SaveIcon/SaveIcon";
import classes from "./EastWhismanViewer.module.scss";
import { SimulationModal } from "pages/simulation/components/SimulationModal/SimulationModal";
import { ReactComponent as SimulationIconSVG } from "styling/assets/icons/simulation-analysis.svg";
import { ReactComponent as PlanningConstraintsIcon } from "styling/assets/icons/planning_constraints_icon.svg";
import { ReactComponent as FinancialMainLogo } from "styling/assets/icons/feasibility_calculator_nav_icon.svg";
import { IconButton } from "../../../../styling/components/IconButton/IconButton";
import { ScenarioPhase } from "types/scenario";
import { useWorkspaceStore } from "stores/workspaceStore";
import { useProjectStore } from "stores/projectStore";
import { getUserGroupName } from "pages/workspace/constants";

type ModalType = "none" | "compliance" | "financials" | "simulation";

export const EastWhismanViewer = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [selectedScenarios] = useSelectedScenarios();
  const [modal, setModal] = useState<ModalType>("none");
  const [workspaceStore] = useWorkspaceStore();
  const [projectStore, projectActions] = useProjectStore();

  const showFinancialsButton = useMemo(
    () => !!buildingService.building && workspaceStore.selectedWorkSpace === "East Whisman", // TODO: Remove this once new Envision CA is released
    [buildingService.building, workspaceStore.selectedWorkSpace]
  );

  const closeModals = useCallback(() => setModal("none"), []);
  const openFinancials = useCallback(() => setModal("financials"), []);
  const openCompliance = useCallback(() => setModal("compliance"), []);
  const openSimulation = useCallback(() => setModal("simulation"), []);

  // TODO: Remove this check once we have weather data for NB and MP,
  // or come up with solution to show button for areas we have data for
  const showSimulationButton = useMemo(
    () => workspaceStore.selectedWorkSpace === "East Whisman" || workspaceStore.selectedWorkSpace === "Envision",
    [workspaceStore.selectedWorkSpace]
  );

  const [showPlanning, setShowPlanning] = useState<boolean>(false);
  useEffect(() => {
    projectActions.getProjectComplianceData(getUserGroupName(workspaceStore.selectedWorkSpace));
  }, [workspaceStore.selectedWorkSpace]);

  useEffect(() => {
    const show = projectStore.selectedProjectPlanning && projectStore.selectedProjectPlanning.length > 1 ? true : false;
    setShowPlanning(show);
  }, [projectStore.selectedProjectPlanning]);

  return (
    <>
      <LoFiViewer />
      <div className={classes.buttons}>
        {selectedScenarios.length > 0 && selectedScenarios[0].phase !== ScenarioPhase.Solved && <SaveIcon />}

        {showFinancialsButton ? (
          modal === "financials" ? (
            <ScenarioFinancialsModal
              closeModal={closeModals}
              scenarioId={selectedScenarios[0].id}
              scenarioName={selectedScenarios[0].name}
            />
          ) : (
            <IconButton title="Feasibility Calculator" Icon={FinancialMainLogo} onClick={openFinancials} />
          )
        ) : null}

        {modal === "compliance" ? (
          <ComplianceModal closeCompliance={closeModals} />
        ) : (
          <>
            {showPlanning && (
              <IconButton title="Planning Constraints" Icon={PlanningConstraintsIcon} onClick={openCompliance} />
            )}
          </>
        )}

        {showSimulationButton ? (
          modal === "simulation" ? (
            <SimulationModal closeModal={closeModals} />
          ) : (
            <IconButton title="Simulation Analysis" Icon={SimulationIconSVG} onClick={openSimulation} />
          )
        ) : null}
      </div>
    </>
  );
};
