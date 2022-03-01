import {
  useUploadBuildingSTL,
  useUploadContextSTL
} from "pages/configurator/components/LoFiViewer/Simulation/STLUploader/useUploadSTLs";

/**
 * When the component is mounted the lofi scene is transformed to STL format and uploaded to
 * the simulations API. This is the representation the simulations are run on.
 * Will only upload when necessary, such as when modifying configuration or creating a
 * new scenario.
 */
export const STLUploader = () => {
  useUploadBuildingSTL();
  useUploadContextSTL();

  return null;
};
