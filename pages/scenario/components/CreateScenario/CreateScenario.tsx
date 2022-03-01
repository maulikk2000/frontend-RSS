import React, { useState, useEffect } from "react";
import Modal from "styling/components/Modal/Modal";
import ModalActions from "styling/components/Modal/ModalActions";
import TextFieldLabel from "styling/components/TextFieldLabel/TextFieldLabel";
import { useScenarioStore } from "../../../../stores/scenarioStore";
import classes from "./CreateScenario.module.scss";
import { Checkbox } from "styling/components/Checkbox/Checkbox";
import { Button } from "styling/components/Button/Button";
import { useProjectStore } from "stores/projectStore";
import { ApiCallState } from "types/common";

type Props = {
  callBack?: (newScenarioId?: string) => void;
};

const CreateScenario: React.FC<Props> = ({ callBack }: Props) => {
  const [scenarioState, scenarioStoreActions] = useScenarioStore();
  const [projectStore] = useProjectStore();
  const [name, setName] = useState("Enter a unique scenario name");
  const [description] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isBaselineScenarioChecked, setIsBaselineScenarioChecked] = useState(false);
  const initialScenarioText = "Enter a unique scenario name";

  const validateInitialEmptyScenario = () => {
    return name === initialScenarioText || name.length === 0 ? true : false;
  };

  const handleClose = () => {
    setName("");
    setModalIsOpen(false);
    if (!!callBack) callBack();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCreate = async () => {
    const newScenarioId = await scenarioStoreActions.createScenario({
      name: name.trim(),
      description: description,
      projectId: projectStore.selectedProjectId,
      isBaselineScenario: isBaselineScenarioChecked
    });

    if (newScenarioId) {
      if (!!callBack) callBack(newScenarioId);
    }
  };

  const setBaselineScenario = () => {
    setIsBaselineScenarioChecked(!isBaselineScenarioChecked);
  };

  const handleTextboxSelected = () => {
    if (name === initialScenarioText) setName("");
  };

  return (
    <React.Fragment>
      <Modal isOpen={modalIsOpen} close={handleClose} type="create">
        <span className={classes.heading}>Create a New Scenario</span>
        <div className={classes.name}>
          <TextFieldLabel
            autoFocus={true}
            variant="outlined"
            id="scenarioName"
            type="text"
            required={true}
            editable={true}
            fullWidth={true}
            value={name}
            handleChange={handleNameChange}
            onTextboxSelected={handleTextboxSelected}
          />
        </div>
        <div className={classes.checkbox}>
          <Checkbox
            onChange={setBaselineScenario}
            checked={isBaselineScenarioChecked}
            label="Set as Baseline Scenario"
          />
          <p className={classes.note}>Note: A project can only have one baseline scenario</p>
        </div>
        <ModalActions>
          <div className={classes.actionButtons}>
            <Button
              classType="primary"
              id="test-create-scenario"
              onClick={handleCreate}
              disabled={validateInitialEmptyScenario()}
              isLoading={scenarioState.createState === ApiCallState.Loading}
            >
              Create Scenario
            </Button>
            <Button classType="secondary" id="test-cancel-scenario" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </ModalActions>
      </Modal>
    </React.Fragment>
  );
};

export default CreateScenario;
