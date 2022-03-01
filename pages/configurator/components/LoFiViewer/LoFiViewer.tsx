import { useRef } from "react";
import { Canvas } from "react-three-fiber";
import { NeighbouringBuildingsLoader } from "../Loader/NeighbouringBuildingsLoader";
import { LoFiPanels } from "../Panels/LoFiPanels";
import { LoFiScene } from "./Scene/LoFiScene";
import classes from "./LoFiViewer.module.scss";
import { Inspectors } from "./Inspectors";
import { useStoreConfigInNodeStore } from "stores/nodes/nodeStoreDemo";

export const LoFiViewer = () => {
  const overlayElement = useRef<HTMLDivElement>(null!);

  useStoreConfigInNodeStore();

  return (
    <div className={classes.lofi_viewer}>
      <NeighbouringBuildingsLoader />

      <Canvas className={classes.lofi_canvas}>
        <LoFiScene />
        <Inspectors container={overlayElement.current} />
      </Canvas>

      {/* A fullscreen container that the inspector components will render into. Cannot
render HTML inside the <Canvas> so a ref to this div is used. */}
      <div ref={overlayElement} />
      <LoFiPanels />
    </div>
  );
};
