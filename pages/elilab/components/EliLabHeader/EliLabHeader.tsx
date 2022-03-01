import { FC, useState } from "react";
import classes from "../../EliLabPage.module.scss";
import { Button } from "styling/components/Button/Button";
import Modal from "styling/components/Modal/Modal";
import EliLabAddFeature from "../Feature/EliLabAddFeature/EliLabAddFeature";
import { ReactComponent as PeopleSvg } from "styling/assets/icons/lab_asset_people.svg";

const EliLabHeader: FC = () => {
  const [modalOpen, setModelOpen] = useState(false);

  const handleClose = () => {
    setModelOpen(false);
  };

  const openModal = () => {
    setModelOpen(true);
  };

  return (
    <div>
      <header className={classes.eliLabHeader}>
        <div className={classes.headerText}>
          <h1>Lab</h1>
          <p>Welcome</p>
          <p>
            This page houses the collection of research and development experiments. Here you can find details of each
            experiment by simply clicking on a card. Each card will direct you to the specific research page
          </p>
          <p>Search for..</p>
          <Button classType="secondary" onClick={openModal} id="addExperiment">
            + Add New Experiment
          </Button>
        </div>
        <div className={classes.headerImg}>
          <PeopleSvg />
        </div>
      </header>
      <Modal type="create" isOpen={modalOpen} close={handleClose}>
        <EliLabAddFeature handleClose={handleClose} />
      </Modal>
    </div>
  );
};

export default EliLabHeader;
