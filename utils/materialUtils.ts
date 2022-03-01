import {
  LineBasicMaterial,
  LineBasicMaterialParameters,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  MeshLambertMaterial,
  MeshLambertMaterialParameters,
  MeshPhongMaterial,
  MeshPhongMaterialParameters
} from "three/src/materials/Materials";
import { MeshLineMaterial } from "three.meshline";
import { isEqual } from "lodash-es";

type materialParameterExtendedType = { mapUrl?: string };

class MaterialFactory<T> {
  private materialsMap: Map<any, T> = new Map();

  //Map parameter is a big texture object, so it is not used for key comparison.
  //A mapURL parameter is required when Map parameter is defined.
  //It is used for key comparison, but it will be omitted when passed to createMaterial().
  createOrGetInstance(materialType: new (params?: any) => T, materialParameters: any): T {
    let materialInstance: any;
    const { map, ...noMapMaterialParameters } = materialParameters;
    for (const key of this.materialsMap.keys()) {
      if (isEqual(key, noMapMaterialParameters)) {
        materialInstance = this.materialsMap.get(key);
      }
    }
    if (!materialInstance) {
      const { mapUrl, ...noCustomPropMaterialParameters } = materialParameters;
      materialInstance = new materialType(noCustomPropMaterialParameters);
      this.materialsMap.set(noMapMaterialParameters, materialInstance);
    }
    return materialInstance as T;
  }
}

const cachedMeshBasicMaterialFactory = new MaterialFactory<MeshBasicMaterial>();
export const getMeshBasicMaterialInstance = (
  materialParameters: MeshBasicMaterialParameters & materialParameterExtendedType
): MeshBasicMaterial => {
  return cachedMeshBasicMaterialFactory.createOrGetInstance(MeshBasicMaterial, materialParameters);
};

const cachedMeshLambertMaterialFactory = new MaterialFactory<MeshLambertMaterial>();
export const getMeshLambertMaterialInstance = (
  materialParameters: MeshLambertMaterialParameters & materialParameterExtendedType
): MeshLambertMaterial => {
  return cachedMeshLambertMaterialFactory.createOrGetInstance(MeshLambertMaterial, materialParameters);
};

const cachedMeshPhongMaterialFactory = new MaterialFactory<MeshPhongMaterial>();
export const getMeshPhongMaterialInstance = (
  materialParameters: MeshPhongMaterialParameters & materialParameterExtendedType
): MeshPhongMaterial => {
  return cachedMeshPhongMaterialFactory.createOrGetInstance(MeshPhongMaterial, materialParameters);
};

const cachedLineBasicMaterialFactory = new MaterialFactory<LineBasicMaterial>();
export const getLineBasicMaterialInstance = (materialParameters: LineBasicMaterialParameters): LineBasicMaterial => {
  return cachedLineBasicMaterialFactory.createOrGetInstance(LineBasicMaterial, materialParameters);
};

const cachedMeshLineMaterialFactory = new MaterialFactory<MeshLineMaterial>();
export const getMeshLineMaterialInstance = (materialParameters: any): MeshLineMaterial => {
  return cachedMeshLineMaterialFactory.createOrGetInstance(MeshLineMaterial, materialParameters);
};
