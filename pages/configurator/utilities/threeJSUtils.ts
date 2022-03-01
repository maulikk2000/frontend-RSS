import { Box3, Mesh } from "three";

export const detectCollision = (object1: Mesh, object2: Mesh) => {
  if (!object1 || !object2) {
    return false;
  }
  object1.geometry.computeBoundingBox();
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();

  var box1: Box3 = object1.geometry.boundingBox!.clone();
  box1.applyMatrix4(object1.matrixWorld);

  var box2: Box3 = object2.geometry.boundingBox!.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.intersectsBox(box2);
};

export const detectInside = (object1: Mesh, object2: Mesh) => {
  if (!object1 || !object2) {
    return false;
  }
  object1.geometry.computeBoundingBox();
  object2.geometry.computeBoundingBox();
  object1.updateMatrixWorld();
  object2.updateMatrixWorld();

  var box1: Box3 = object1.geometry.boundingBox!.clone();
  box1.applyMatrix4(object1.matrixWorld);

  var box2: Box3 = object2.geometry.boundingBox!.clone();
  box2.applyMatrix4(object2.matrixWorld);

  return box1.containsBox(box2);
};
