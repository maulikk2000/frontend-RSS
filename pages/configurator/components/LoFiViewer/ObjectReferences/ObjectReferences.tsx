import { useEffect, useRef } from "react";
import { useMeshReferenceStore } from "pages/configurator/stores/meshReferenceStore";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const ObjectReferences = () => {
  const [, meshReferencesActions] = useMeshReferenceStore();

  const orbitRef = useRef<OrbitControls | undefined>();

  useEffect(() => {
    meshReferencesActions.setOrbitRef(orbitRef);
  }, []);

  return null;
};
