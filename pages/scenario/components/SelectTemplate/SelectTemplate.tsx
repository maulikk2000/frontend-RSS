import React, { useState } from "react";
import classes from "./SelectTemplate.module.scss";
import { Button } from "styling/components/Button/Button";
import { useSelectedProject } from "stores/projectStore";
import { SiteConfiguration } from "pages/configurator/data/v2/types";
import { useScenarioStore } from "stores/scenarioStore";
import {
  createCustomSiteConfiguration,
  createEastWhismanSiteConfiguration
} from "pages/configurator/utilities/configurationUtils";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { selectTemplateOptions, eastWhismanTemplateSmall, eastWhismanTemplateLarge } from "./data/types";
import CustomSelectTemplateOptions from "./CustomOptions/CustomSelectTemplateOptions";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import { CustomModal } from "styling/components/Modal/CustomModal";
import { useWorkspaceStore } from "stores/workspaceStore";

type SelectTemplateProps = {
  parentCallback?: (stepNumber) => void;
};

const SelectTemplate: React.FC<SelectTemplateProps> = ({ parentCallback }: SelectTemplateProps) => {
  const stepNumber = 1;
  const [scenarioStore] = useScenarioStore();
  const [selectedProject] = useSelectedProject();
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [workspaceStore] = useWorkspaceStore();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const selectMassingTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setActionButtonDisabled(templateKey ? false : true);
  };

  const setLoadingStatus = (status: boolean) => {
    setActionButtonDisabled(status);
    setIsLoading(status);
  };

  const createSiteConfiguration = async () => {
    let configuration: SiteConfiguration;

    if (!selectedProject || scenarioStore.selectedScenarioIds.length === 0) {
      return;
    }
    if (selectedTemplate === eastWhismanTemplateSmall || selectedTemplate === eastWhismanTemplateLarge) {
      configuration = createEastWhismanSiteConfiguration(
        selectedTemplate,
        scenarioStore.selectedScenarioIds[0],
        selectedProject!
      );
    } else {
      configuration = createCustomSiteConfiguration(scenarioStore.selectedScenarioIds[0], selectedProject!);
    }

    setLoadingStatus(true);
    await buildingServiceActions.createConfiguration(configuration);
    setLoadingStatus(false);
    if (!!parentCallback) parentCallback(stepNumber);
  };

  const showConfirmation = async () => {
    if (buildingService.configuration) {
      setModalIsOpen(true);
    } else {
      await createSiteConfiguration();
    }
  };

  const handleClose = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div>
        <CustomSelectTemplateOptions
          options={selectTemplateOptions(workspaceStore.selectedWorkSpace)}
          onClick={selectMassingTemplate}
          optionSelected={selectedTemplate}
          center={true}
        ></CustomSelectTemplateOptions>
        <div className={classes.cta}>
          <Button classType="primary" onClick={showConfirmation} disabled={actionButtonDisabled}>
            <span className={classes.nextBtnLabel}>Next</span> {isLoading ? <LoadingSpinner size="small" /> : null}
          </Button>
        </div>
      </div>
      <CustomModal
        title="Confirm template change"
        description="Are you sure you want to change the massing template? Current configurations will be lost."
        handleClose={handleClose}
        isOpen={modalIsOpen}
        buttons={[
          { text: "Yes", type: "secondary", onClick: createSiteConfiguration },
          { text: "No", type: "secondary", onClick: handleClose }
        ]}
      />
    </>
  );
};

export default SelectTemplate;
