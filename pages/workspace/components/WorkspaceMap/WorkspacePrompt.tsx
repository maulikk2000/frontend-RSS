import React from "react";
import CustomPrompt from "styling/components/CustomPrompt";
import { useMapStore } from "stores/mapStore";

const WorkspacePrompt: React.FC = () => {
  const [{ drawLayerStatus }] = useMapStore();

  return (
    <CustomPrompt
      message={
        <>
          <p>Any unsaved changes will be lost.</p>
          <p>Do you want to continue?</p>
        </>
      }
      when={drawLayerStatus === "unsaved"}
    />
  );
};

export default WorkspacePrompt;
