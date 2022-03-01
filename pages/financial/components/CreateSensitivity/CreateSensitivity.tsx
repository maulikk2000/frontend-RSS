import React, { useState } from "react";
import { useScenarioStore } from "stores/scenarioStore";
import { Button } from "styling/components/Button/Button";
import { Checkbox } from "styling/components/Checkbox/Checkbox";
import Modal from "styling/components/Modal/Modal";
import ModalActions from "styling/components/Modal/ModalActions";
import TextFieldLabel from "styling/components/TextFieldLabel/TextFieldLabel";
import { SensitivityCreateVariables } from "types/financial";
import classes from "./CreateSensitivity.module.scss";

type Props = {
  createSensitivity: (createVariables: SensitivityCreateVariables) => void;
  callBack: () => void;
};

const CreateSensitivity: React.FC<Props> = ({ createSensitivity, callBack }: Props) => {
  const [name, setName] = useState("New Financial Feasibility Assessment");
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isBaselineSensitivityChecked, setIsBaselineSensitivityChecked] = useState(false);
  const initialSensitivityText = "New Financial Feasibility Assessment";
  const [scenarioStore] = useScenarioStore();

  const scenarioId = scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : "";

  const validateInitialEmptySensitivity = () => {
    return name === initialSensitivityText || name.length === 0 ? true : false;
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
    //TODO: get values from workspaces
    createSensitivity({
      variables: {
        name: name,
        region: "AU", //TODO
        scenarioId: scenarioId,
        status: "InProgress", //TODO InProgress, Completed, Cancelled
        type: "lcaDiscon", //TODO default to lcaDiscon
        isBaseLine: isBaselineSensitivityChecked
      }
    });
  };

  const setBaselineSensitivity = () => {
    setIsBaselineSensitivityChecked(!isBaselineSensitivityChecked);
  };

  const handleTextboxSelected = () => {
    if (name === initialSensitivityText) setName("");
  };

  return (
    <React.Fragment>
      <Modal isOpen={modalIsOpen} close={handleClose} type="create">
        <span className={classes.heading}>Create a Financial Feasibility Assessment</span>
        <p>Enter a unique name for Financial Feasibility Assessment</p>
        <div className={classes.name}>
          <TextFieldLabel
            autoFocus={true}
            variant="outlined"
            id="sensitivityName"
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
            onChange={setBaselineSensitivity}
            checked={isBaselineSensitivityChecked}
            label="Set as Baseline"
          />
          <p className={classes.note}>Note: A scenario can only have one Financial Feasibility Assessment Baseline</p>
        </div>
        <ModalActions>
          <div className={classes.actionButtons}>
            <Button
              classType="primary"
              id="test-create-sensitivity"
              onClick={handleCreate}
              disabled={validateInitialEmptySensitivity()}
              // isLoading={sensitivityState.createState === ApiCallState.Loading}
            >
              Create
            </Button>
            <Button classType="secondary" id="test-cancel-sensitivity" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </ModalActions>
      </Modal>
    </React.Fragment>
  );
};

export default CreateSensitivity;
