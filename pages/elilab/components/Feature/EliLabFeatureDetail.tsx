import { FC, useState } from "react";
import classes from "../../EliLabPage.module.scss";
import { ILabFeature } from "pages/elilab/interface/ILabFeature";
import EliLabFrame from "./EliLabIframe";
import Modal from "styling/components/Modal/Modal";

interface IEliLabFeatureProps {
  feature: ILabFeature;
}

const EliLabFeatureDetail: FC<IEliLabFeatureProps> = ({ feature }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {feature.experimentPageLink === "/analysis" ? (
        <a style={{ textDecoration: "none" }} href={feature.experimentPageLink} className={classes.anchor}>
          <div className={classes.container} onClick={handleClickOpen}>
            <div className={classes.imgContainer}>
              <img src={feature.imagePath} alt="" />
            </div>
            <div className={classes.featureText}>
              <div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </div>
              <div className={classes.tagDetails}>
                {feature.tagDetails?.map((tagDetail) => (
                  <button style={{ background: tagDetail.hexColour }}>{tagDetail.description}</button>
                ))}
              </div>
            </div>
          </div>
        </a>
      ) : (
        <div>
          <div className={classes.container} onClick={handleClickOpen}>
            <div className={classes.imgContainer}>
              <img src={feature.imagePath} alt="" />
            </div>
            <div className={classes.featureText}>
              <div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </div>
              <div className={classes.tagDetails}>
                {feature.tagDetails?.map((tagDetail, index) => (
                  <button style={{ background: tagDetail.hexColour }}>{tagDetail.description}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Modal isOpen={open} header={feature.name} type="fullscreen" close={handleClose} id={feature.name + "1"}>
              <EliLabFrame src={feature.experimentPageLink}></EliLabFrame>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliLabFeatureDetail;
