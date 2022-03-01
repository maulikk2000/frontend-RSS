import Switch from "@material-ui/core/Switch";
import { FiberManualRecord } from "@material-ui/icons";
import { useLayerDisplayStore } from "pages/configurator/stores/layerDisplayStore";
import React, { FC, useEffect, useState } from "react";
import { useProjectStore } from "stores/projectStore";
import { useWorkspaceStore } from "stores/workspaceStore";
import { RightModal } from "../../../components/RightModal/RightModal";
import { complianceContent, complianceToggles } from "./complianceContentUtils";
import classes from "./ComplianceModal.module.scss";

type ComplianceModalProps = {
  closeCompliance: () => void;
};

export const ComplianceModal: FC<ComplianceModalProps> = ({ closeCompliance }) => {
  const [layerDisplayState, layerDisplayActions] = useLayerDisplayStore();

  const [toggles, setToggles] = useState(complianceToggles());

  return (
    <RightModal title="Planning Constraints" onClose={closeCompliance}>
      {complianceContent.map((item, index) => {
        return (
          <div className={classes.contentItem} key={index}>
            <div className={classes.layerTitleAndToggle}>
              <h4 className={classes.heading}>{item.name}</h4>
              {/*
                  the "toggle_component" class name on the material UI 
                  Switch component needs to be added in order for 
                  the Switch to inherit the custom eli styling
                */}
              <Switch
                name={item.name}
                size="small"
                className="toggle_component"
                checked={layerDisplayState.complianceLayers[item.id]}
                onChange={(e) => {
                  setToggles({
                    ...toggles,
                    [e.target.name]: e.target.checked
                  });

                  layerDisplayActions.showComplianceLayer(item.id, e.target.checked);
                }}
              />
            </div>
            {item.layers?.map((layer, index) => {
              return (
                <div key={index}>
                  <div className={classes.layerIconNameAndValue}>
                    <div className={classes.layerIcon}>
                      <FiberManualRecord htmlColor={layer.iconColor} />
                    </div>
                    <p>{layer.name}</p>
                    <p className={classes.layerValue}>{layer.value}</p>
                  </div>
                  <div className={classes.layerLink}>
                    <a target="_blank" href={layer.link}>
                      {layer.section}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <p className={classes.tAndC}>
        Figures are indicative only. Refer to the East Whisman Precise Plan, Section 3.3.1 for General Height Standards
        and Section 3.4 for further information regarding each constraint.
      </p>
    </RightModal>
  );
};
