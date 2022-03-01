import { degreesToRadians } from "@turf/helpers";
import {
  BufferGeometry,
  BoxBufferGeometry,
  CylinderBufferGeometry,
  CircleBufferGeometry,
  TorusBufferGeometry
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { materialLibrary } from "utils/materialLibrary";

const nullGeometry = new BufferGeometry();

export const modifyRotationGizmo = (transformControl: TransformControls) => {
  const gizmos = transformControl.children.find((child) => child.type === "TransformControlsGizmo");
  for (const child of gizmos!.children) {
    child.children.forEach((child: any) => {
      if (child.type === "Line" || child.name !== "Z") {
        child.material.dispose();
        child.geometry.dispose();
        child.geometry = nullGeometry;
        return;
      }

      child.geometry = new TorusBufferGeometry(0.2, 0.03, 4, 24);
      child.material = materialLibrary.meshBasicMaterial_ModifyRotationGizmo;
    });
  }
};

export const modifyVertexGizmo = (transformControl: TransformControls, showXModifer: boolean) => {
  const sphere = new CircleBufferGeometry(0.04, 32, 32);
  const sphereOutter = new CircleBufferGeometry(0.06, 32, 32);

  var arrowGeometry1 = new CylinderBufferGeometry(0.03, 0, 0.12, 12, 1, false);
  arrowGeometry1.rotateZ(degreesToRadians(90));
  arrowGeometry1.translate(0.15, 0, 0);
  var arrowGeometry2 = new CylinderBufferGeometry(0.03, 0, 0.12, 12, 1, false);
  arrowGeometry2.rotateZ(degreesToRadians(-90));
  arrowGeometry2.translate(-0.15, 0, 0);

  const arrowGeometry = BufferGeometryUtils.mergeBufferGeometries([arrowGeometry1, arrowGeometry2]);

  const gizmos = transformControl.children.find((child) => child.type === "TransformControlsGizmo");
  for (const child of gizmos!.children) {
    child.children.forEach((child: any) => {
      if (child.name !== "XY") {
        if (child.name === "X" && showXModifer && child.type !== "Line") {
          child.geometry.dispose();
          child.material.dispose();
          child.geometry = arrowGeometry;
          child.material = materialLibrary.meshBasicMaterial_ModifyVertexGizmoXY;
          return;
        }
        child.material.dispose();
        child.geometry.dispose();
        child.geometry = nullGeometry;
        return;
      }

      if (child.type === "Line") {
        child.geometry = sphereOutter;
        child.material = materialLibrary.lineBasicMaterial_ModifyVertexGizmoLine;
      } else {
        child.geometry = sphere;
        child.material = materialLibrary.meshBasicMaterial_ModifyVertexGizmoXY;
      }
    });
  }
};

export const modifyMovementGizmo = (transformControl: TransformControls) => {
  const box = new BoxBufferGeometry(0.1, 0.1, 0.1);

  const gizmos = transformControl.children.find((child) => child.type === "TransformControlsGizmo");
  for (const child of gizmos!.children) {
    child.children.forEach((child: any) => {
      if (child.name !== "XY" || child.type === "Line") {
        child.material.dispose();
        child.geometry.dispose();
        child.geometry = nullGeometry;
        return;
      }
      child.geometry = box;
      child.material = materialLibrary.meshBasicMaterial_ModifyMovementGizmo;
    });
  }
};

export const modifyHeightGizmo = (transformControl: TransformControls) => {
  var arrowGeometry1 = new CylinderBufferGeometry(0, 0.03, 0.12, 12, 1, false);
  arrowGeometry1.rotateX(degreesToRadians(90));
  arrowGeometry1.translate(0, 0, 0.12);

  const arrowGeometry = BufferGeometryUtils.mergeBufferGeometries([arrowGeometry1]);

  const gizmos = transformControl.children.find((child) => child.type === "TransformControlsGizmo");
  for (const child of gizmos!.children) {
    child.children.forEach((child: any) => {
      if (child.name !== "Z" || child.type === "Line") {
        child.material.dispose();
        child.geometry.dispose();
        child.geometry = nullGeometry;
        return;
      }
      child.geometry = arrowGeometry;
      child.material = materialLibrary.meshBasicMaterial_ModifyHeightGizmo;
    });
  }
};
