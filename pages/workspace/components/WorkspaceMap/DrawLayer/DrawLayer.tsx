import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./DrawLayer.module.scss";
import { ReactComponent as PolygonIcon } from "styling/assets/icons/sitetools-polygon.svg";
import { ReactComponent as EditIcon } from "styling/assets/icons/sitetools-edit.svg";
import { ReactComponent as DeleteIcon } from "styling/assets/icons/sitetools-delete.svg";
import { ToolBar } from "styling/components/ToolBar";
import { ImmutableFeatureCollection } from "@nebula.gl/edit-modes";
import { EditorSelectHandler, EditorUpdateHandler, EditorUpdateParams } from "pages/workspace/types";
import { Editor } from "@xharmagne/react-map-gl-draw";
import { Feature } from "geojson";
import { useMapStore } from "stores/mapStore";
import { DrawPolygonWithMeasureMode } from "./DrawPolygonWithMeasureMode";
import { editHandleStyle, featureStyle, tooltipStyle } from "./constants";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { useActiveProject, useProjectStore } from "stores/projectStore";
import { createGeoJSONFromCoordinates } from "pages/workspace/utils/mapUtils";
import { useHotkeys } from "react-hotkeys-hook";
import { hotkeycodes } from "types/hotkeys";
import { Confirm } from "styling/components/Confirm/Confirm";
import { debounce } from "lodash-es";
import { EditingWithMeasureMode } from "./EditingWithMeasureMode";

type Props = {
  onSiteSelected: (feature?: Feature) => void;
  onIsLayerActiveChanged?: (isActive: boolean) => void;
};

type Mode = DrawPolygonWithMeasureMode | EditingWithMeasureMode | undefined;

export const DrawLayer = ({ onSiteSelected, onIsLayerActiveChanged }: Props) => {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>();
  const [mapStore, { setDrawLayerStatus }] = useMapStore();
  const [, projectAction] = useProjectStore();
  const editor = useRef<Editor>(null!);
  const [selectedWorkspace] = useSelectedWorkspace();
  const [activeProject] = useActiveProject();
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useHotkeys(hotkeycodes.escape, () => {
    toggleDrawMode();
    setMode(undefined);
  });

  useEffect(() => {
    if (!mapStore.showCreateProjectModal) {
      editor.current._onSelect({
        selectedFeature: null,
        selectedFeatureIndex: null,
        mapCoords: null,
        screenCoords: null
      } as any);
    }
  }, [mapStore.showCreateProjectModal]);

  useEffect(() => {
    if (activeProject?.coordinates) {
      setMode(new EditingWithMeasureMode());
      const feature = createGeoJSONFromCoordinates(activeProject.coordinates, "editProject")?.features?.[0];
      // @ts-ignore
      editor.current.addFeatures(feature);
      onSiteSelected(feature);
      setSelectedFeatureIndex(0);
      projectAction.setActiveProjectAction(undefined);
    }
  }, [activeProject]);

  useEffect(() => {
    if (activeProject) {
      const action = editor.current.getFeatures()?.length ? undefined : "DELETE";
      projectAction.setActiveProjectAction(selectedFeatureIndex !== null ? "PATCH" : action);
    } else {
      projectAction.setActiveProjectAction(undefined);
      setDrawLayerStatus(editor.current.getFeatures()?.length > 0 ? "unsaved" : undefined);
    }
  }, [activeProject, selectedFeatureIndex]);

  const deletePoint = (selectedFeatureIndex: number) => {
    if (
      editor.current.getFeatures()?.[selectedFeatureIndex].geometry["coordinates"][0].length < 5 ||
      editor.current.getFeatures()?.[0].geometry["coordinates"][0].length -
        editor.current.state.selectedEditHandleIndexes.length <
        4
    ) {
      setShowConfirmDelete(true);
      return;
    } else {
      editor.current.deleteHandles(selectedFeatureIndex, editor.current.state.selectedEditHandleIndexes);
      const featureCollection: ImmutableFeatureCollection = editor.current.deleteHandles(
        selectedFeatureIndex,
        editor.current.state.selectedEditHandleIndexes
      ) as any;
      const selectedFeature = featureCollection.getObject().features[selectedFeatureIndex];
      onSiteSelected(selectedFeature as Feature);
      return;
    }
  };

  const handleDelete = useCallback(() => {
    const { selectedFeatureIndex, selectedEditHandleIndexes } = editor.current.state ?? {};
    const isPointActive =
      selectedFeatureIndex != null && selectedFeatureIndex !== -1 && selectedEditHandleIndexes?.length > 0;

    if (isPointActive) {
      return deletePoint(selectedFeatureIndex as number);
    }

    if (isInEditMode) {
      deleteSelectedFeature();
    }

    if (isInDrawMode) {
      //we use toggle here because there is no selected feature when in drawmode
      toggleDrawMode();
      setMode(undefined);
    }
  }, [onSiteSelected, selectedFeatureIndex, mode]);

  const handleUpdate: EditorUpdateHandler = useCallback(
    debounce(({ editType, editContext, data }: EditorUpdateParams) => {
      // When a polygon was just created,
      // go into edit mode and select that polygon
      if (editType === "addFeature") {
        setMode(new EditingWithMeasureMode());
        if (editContext.featureIndexes && editContext.featureIndexes.length === 1) {
          const featureIndex = editContext.featureIndexes[0];
          editor.current._onSelect({
            selectedFeature: editor.current.getFeatures()[featureIndex],
            selectedFeatureIndex: featureIndex,
            mapCoords: null,
            screenCoords: null
          } as any); // Using any for now because for some reason typescript lint expects selectedEditHandleIndexes but compile expects selectedEditHandleIndex
        }
      }
      if (editType === "movePosition" && data.length === 1) {
        onSiteSelected(data[0]);
      }
    }, 250),
    [onSiteSelected]
  );

  const handleSelect: EditorSelectHandler = useCallback(
    ({ selectedFeature, selectedFeatureIndex }) => {
      if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0 && selectedFeature !== null) {
        setSelectedFeatureIndex(selectedFeatureIndex);
        onSiteSelected(selectedFeature);
      } else {
        setSelectedFeatureIndex(null);
        onSiteSelected(undefined);
      }
    },
    [onSiteSelected, activeProject]
  );

  const selectMode = useCallback(
    (selectedMode: Mode) => {
      onSiteSelected(undefined);
      setMode(selectedMode);
      if (onIsLayerActiveChanged) {
        const isLayerActive = selectedMode != null;
        onIsLayerActiveChanged(isLayerActive);
      }
    },
    [onIsLayerActiveChanged, onSiteSelected]
  );

  const deselectMode = useCallback(() => {
    selectMode(undefined);
  }, [selectMode]);

  const toggleEditMode = useCallback(() => {
    if (mode instanceof EditingWithMeasureMode) {
      deselectMode();
    } else {
      selectMode(new EditingWithMeasureMode());
    }
  }, [deselectMode, mode, selectMode]);

  const toggleDrawMode = useCallback(() => {
    if (mode instanceof DrawPolygonWithMeasureMode) {
      deselectMode();
      setSelectedFeatureIndex(null);
    } else {
      selectMode(new DrawPolygonWithMeasureMode());
    }
  }, [deselectMode, mode, selectMode]);

  const deleteSelectedFeature = useCallback(() => {
    if (selectedFeatureIndex != null) {
      editor.current.deleteFeatures([selectedFeatureIndex]);
      onSiteSelected(undefined);
      setSelectedFeatureIndex(null);
      setShowConfirmDelete(false);
    }
  }, [onSiteSelected, selectedFeatureIndex]);

  useHotkeys(hotkeycodes.delete, handleDelete, [onSiteSelected, selectedFeatureIndex]);
  useHotkeys(hotkeycodes.backspace, handleDelete, [onSiteSelected, selectedFeatureIndex]);

  const isInDrawMode = mode instanceof DrawPolygonWithMeasureMode;
  const isInEditMode = mode instanceof EditingWithMeasureMode;

  const msg = "Deleting this point/s will delete the whole polygon, do you want to continue?";

  return (
    <>
      <Confirm
        message={msg}
        isDisplayed={showConfirmDelete}
        onConfirm={deleteSelectedFeature}
        onCancel={() => setShowConfirmDelete(false)}
      />
      <div className={`${classes.container} ${isInDrawMode ? classes.draw : isInEditMode ? classes.edit : undefined}`}>
        <Editor
          ref={editor}
          mode={mode}
          onUpdate={handleUpdate}
          onSelect={handleSelect}
          featureStyle={featureStyle}
          editHandleStyle={editHandleStyle}
          editHandleShape="circle"
          tooltipStyle={tooltipStyle}
          selectedFeatureIndex={selectedFeatureIndex}
          modeConfig={{ measurement: selectedWorkspace?.measurement }}
        />

        <ToolBar
          tools={[
            {
              Icon: PolygonIcon,
              title: "Draw polygon",
              isActive: isInDrawMode,
              onClick: toggleDrawMode,
              group: "primary",
              analyticsId: "DrawSite_DrawPolygon"
            },
            {
              Icon: EditIcon,
              title: "Edit",
              isActive: isInEditMode,
              onClick: toggleEditMode,
              group: "primary",
              analyticsId: "DrawSite_Edit"
            },
            {
              Icon: DeleteIcon,
              title: "Delete",
              onClick: handleDelete,
              group: "secondary",
              analyticsId: "DrawSite_Delete"
            }
          ]}
        />
      </div>
    </>
  );
};
