import React, { useState } from "react";
import { useSiteNoteStore } from "pages/configurator/stores/siteNoteStore";
import { MeshLine } from "three.meshline";
import { SiteNoteLabel } from "./SiteNoteLabel";
import { Mesh } from "three";
import { SiteNoteVertex } from "./SiteNoteVertex";
import { useSelectedScenarios } from "stores/scenarioStore";
import { getCentreOfVectors, getDistanceBetweenVectors } from "pages/configurator/components/utils";
import { toDecimalPlace } from "utils/strings";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { SiteNoteObject } from "types/siteNote";
import { defaultMeasurementUnit } from "utils/constants";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { measurementUnitDisplay } from "utils/units";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  siteNote: SiteNoteObject;
  isDrawing: boolean;
  deleteSiteNote: (siteNote: SiteNoteObject) => void;
};

export const SiteNote = ({ siteNote, isDrawing, deleteSiteNote }: Props) => {
  const [siteNoteStore, siteNoteStoreActions] = useSiteNoteStore();
  const [selectedScenarios] = useSelectedScenarios();
  const [configSettings] = useConfiguratorSettingsStore();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const [vertexHovered, setVertexHovered] = useState<boolean>(false);
  const [label] = useState<string>(siteNote.label);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const mesh = new Mesh();
  const meshLine = new MeshLine();
  meshLine.setPoints(siteNote.points);
  mesh.geometry = meshLine;

  const handleSubmit = (labelText) => {
    setIsEdit(false);
    if (selectedScenarios.length === 0) {
      return;
    }
    let allSiteNotes: SiteNoteObject[] = [...siteNoteStore.siteNotes];
    allSiteNotes.forEach((note) => {
      if (note === siteNote && labelText) {
        note.label = labelText;
      }
    });
    siteNoteStoreActions.setSiteNotes(allSiteNotes, selectedScenarios[0]);
  };

  const distance = `${toDecimalPlace(getDistanceBetweenVectors(siteNote.points, configSettings.is2D), 2)} ${
    measurementUnitDisplay[measurementUnit.lengthUnit]
  }`;
  return (
    <>
      <primitive object={mesh} material={materialLibrary.meshLineMaterial_SiteNoteMeshLine} />
      {siteNote.points.map((point, index) => (
        <React.Fragment key={index}>
          <SiteNoteVertex
            siteNote={siteNote}
            point={point}
            vertexHovered={vertexHovered}
            setVertexHovered={setVertexHovered}
            deleteSiteNote={deleteSiteNote}
          />
        </React.Fragment>
      ))}
      <mesh position={getCentreOfVectors(siteNote.points)}>
        <SiteNoteLabel
          clickThrough={isDrawing}
          isEdit={isEdit}
          distance={distance}
          label={label}
          setIsEdit={setIsEdit}
          handleSubmit={handleSubmit}
        />
      </mesh>
    </>
  );
};
