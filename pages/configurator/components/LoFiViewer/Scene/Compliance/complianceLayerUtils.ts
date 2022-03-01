import { CompliancePlanning } from "types/planning";

export const addLayerIds = (plan: CompliancePlanning, mesh: THREE.Mesh) => {
  switch (plan.type) {
    case "HIMU":
      mesh.userData.id = "maxHeightAllBuildings";
      break;
    case "MIMU":
      mesh.userData.id = "maxHeightAllBuildings";
      break;
    case "LIMU":
      mesh.userData.id = "maxHeightAllBuildings";
      break;
    case "HRC":
      mesh.userData.id = "maxHeightHighRiseCore";
      break;
    default:
      break;
  }
};
