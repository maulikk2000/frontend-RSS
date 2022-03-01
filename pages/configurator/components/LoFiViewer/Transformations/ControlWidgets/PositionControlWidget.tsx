import { useCallback, useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Mesh, Vector3 } from "three";
import { useMeshReferenceStore } from "pages/configurator/stores/meshReferenceStore";
import { modifyHeightGizmo, modifyMovementGizmo, modifyRotationGizmo, modifyVertexGizmo } from "./gizmoUtils";

extend({ TransformControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      transformControls: any;
    }
  }
}

type Props = {
  position: Vector3;
  mode: "rotate" | "translate" | "height";
  callback: (transformObject: Mesh, commit?: boolean, index?: number | undefined) => void;

  /** Disabling localisation allows for movement
   * (default true)
   */
  local?: boolean;

  /** Angle to ensure the vertex modifiers for length
   * face the right way
   * Applies to vertex modifications only
   */
  direction?: number;

  /**
   * Display X Axis widget
   * Applies to vertex modifications only
   */
  showXModifier?: boolean;
};

export const PositionControlWidget = ({
  position,
  mode,
  callback,
  local = true,
  direction = 0,
  showXModifier = false
}: Props) => {
  const { camera, gl } = useThree();
  const [meshRefs] = useMeshReferenceStore();
  const transform = useRef<TransformControls>(null!);
  const gizmo = useRef<Mesh>(new Mesh());

  const getTransformControlMode = useCallback(() => {
    return mode === "height" ? "translate" : mode;
  }, [mode]);

  useEffect(() => {
    const transformControl = transform.current;
    if (transformControl) {
      transformControl.attach(gizmo.current);
      transformControl.setMode(getTransformControlMode());

      if (mode === "rotate") {
        modifyRotationGizmo(transformControl);
      }

      if (mode === "translate" && !local) {
        modifyMovementGizmo(transformControl);
      }

      if (mode === "height") {
        modifyHeightGizmo(transformControl);
      }

      if (local) {
        modifyVertexGizmo(transformControl, showXModifier);
        gizmo.current.setRotationFromAxisAngle(new Vector3(0, 0, 1), direction);
      }

      if (!local) {
        transformControl.position.copy(position);
      }
      transformControl.space = "local";
      transformControl.showX = mode === "translate";
      transformControl.showY = mode === "translate" && !showXModifier;
      transformControl.showZ = mode === "rotate" || mode === "height";
    }
  }, [mode, position]);

  useEffect(() => {
    if (local) {
      gizmo.current.setRotationFromAxisAngle(new Vector3(0, 0, 1), direction);
    }
  }, [direction]);

  useEffect(() => {
    const transformControl = transform.current;
    if (transformControl && !local) {
      transformControl.position.copy(position);
    }
  }, [position, local, mode]);

  useFrame(() => {
    // hides widget if another is being used
    if (!transform.current) {
      return;
    }
    if (!meshRefs.orbitRef!.current.enabled && !transform.current.dragging) {
      if (transform.current) {
        transform.current.visible = false;
      }
    } else {
      if (transform.current) {
        transform.current.visible = true;

        if (mode === "height") {
          // do not display height when looking from a birdseye view
          if (meshRefs.orbitRef!.current.getPolarAngle() > 0.7) {
            transform.current.enabled = true;
            transform.current.visible = true;
          } else {
            transform.current.enabled = false;
            transform.current.visible = false;
          }
        }
      }
    }
  });

  useEffect(() => {
    const transformControl = transform.current;

    if (!transformControl) {
      return;
    }

    const onDraggingChanged = (event) => {
      meshRefs.orbitRef!.current.enabled = !event.value;
    };

    const onDraggingEnd = () => {
      const commit = true;
      callback(transformControl.object as Mesh, commit);
      if (!local) {
        transformControl.object?.position.copy(new Vector3(0, 0, 0));
      }
    };

    const onChange = () => {
      if (!transformControl.dragging) {
        if (transformControl.object && mode === "rotate") {
          transformControl.object.rotation.z = 0;
        }
        return;
      }

      const commit = false;
      callback(transformControl.object as Mesh, commit);
    };

    transformControl.addEventListener("mouseUp", onDraggingEnd);
    transformControl.addEventListener("change", onChange);
    transformControl.addEventListener("dragging-changed", onDraggingChanged);

    return () => {
      transformControl.removeEventListener("mouseUp", onDraggingEnd);
      transformControl.removeEventListener("change", onChange);
      transformControl.removeEventListener("dragging-changed", onDraggingChanged);
    };
  });

  return (
    <>
      <mesh ref={gizmo} name={"gizmo"} position={!local ? new Vector3(0, 0, 0) : position} />
      <transformControls ref={transform} args={[camera, gl.domElement]} />
    </>
  );
};
