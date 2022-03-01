import materialColors from "styling/materialColors.module.scss";
import { DoubleSide, LineBasicMaterial, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial } from "three";
import { MeshLineMaterial } from "three.meshline";

export const materialLibrary = {
  //--------MeshBasicMaterials----------
  meshBasicMaterial_SolverDefault: new MeshBasicMaterial({ color: materialColors.Lime }),

  meshBasicMaterial_EnvelopCoordinateObject: new MeshBasicMaterial({
    color: materialColors.White,
    opacity: 0.1,
    transparent: true
  }),

  meshBasicMaterial_MapPlaneFloor: new MeshBasicMaterial({
    color: materialColors.MediumGrey
  }),

  meshBasicMaterial_SimulationAnalysisFace: new MeshBasicMaterial({
    vertexColors: true,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1000
  }),

  meshBasicMaterial_AddMassingObject: new MeshBasicMaterial({
    color: materialColors.PodiumBlue,
    opacity: 0.7,
    transparent: true
  }),

  meshBasicMaterial_HoverMeasurementVertex: new MeshBasicMaterial({
    color: materialColors.DarkYellow,
    transparent: true,
    depthTest: false,
    depthWrite: false
  }),

  meshBasicMaterial_SiteNoteVertex: new MeshBasicMaterial({
    color: materialColors.DarkYellow,
    transparent: true,
    depthTest: false,
    depthWrite: false
  }),
  meshBasicMaterial_SiteNoteVertexBackground: new MeshBasicMaterial({
    color: materialColors.White,
    transparent: true,
    depthTest: false,
    depthWrite: false
  }),
  meshBasicMaterial_SiteNoteX: new MeshBasicMaterial({
    color: materialColors.Black,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
    depthWrite: false
  }),
  meshBasicMaterial_SiteNoteXHovered: new MeshBasicMaterial({
    color: materialColors.Red,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
    depthWrite: false
  }),

  meshBasicMaterial_SiteNoteCollision: new MeshBasicMaterial({
    transparent: true,
    opacity: 0
  }),

  meshBasicMaterial_MeasurementToolCursor: new MeshBasicMaterial({
    color: materialColors.White,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
    depthWrite: false
  }),

  meshBasicMaterial_ObjectPointsInnerCircle: new MeshBasicMaterial({
    color: materialColors.White,
    depthTest: false
  }),

  meshBasicMaterial_ModifyMovementGizmo: new MeshBasicMaterial({
    color: materialColors.PodiumMedium,
    depthTest: false,
    transparent: true,
    opacity: 0.4
  }),

  meshBasicMaterial_ModifyRotationGizmo: new MeshBasicMaterial({
    color: materialColors.PodiumMedium,
    depthTest: false,
    transparent: true,
    opacity: 0.4
  }),

  meshBasicMaterial_ModifyHeightGizmo: new MeshBasicMaterial({
    color: materialColors.White,
    depthTest: false
  }),

  meshBasicMaterial_ModifyVertexGizmoXY: new MeshBasicMaterial({
    color: materialColors.White,
    depthTest: false
  }),

  //--------MeshLambertMaterials----------
  meshLambertMaterial_ZoneObject: new MeshLambertMaterial({
    color: materialColors.Zone
  }),

  meshLambertMaterial_DrawPlane: new MeshLambertMaterial({
    opacity: 0,
    color: materialColors.White,
    transparent: true
  }),

  //--------LineBasicMaterials----------
  lineBasicMaterial_ObjectPointsOuterCircle: new LineBasicMaterial({
    color: materialColors.PodiumDarkTeal,
    depthTest: false
  }),

  lineBasicMaterial_ModifyVertexGizmoLine: new LineBasicMaterial({
    color: materialColors.PodiumDarkTeal,
    depthTest: false
  }),

  lineBasicMaterial_SolvedBuildingLine: new LineBasicMaterial({
    color: materialColors.Lines
  }),

  lineBasicMaterial_SimulationAnalysisLine: new LineBasicMaterial({ vertexColors: true }),

  //--------MeshLineMaterials----------
  meshLineMaterial_HoverMeasurementLine: new MeshLineMaterial({
    color: materialColors.DarkYellow,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    sizeAttenuation: 0,
    lineWidth: 0.005
  }),

  meshLineMaterial_SiteNoteMeshLine: new MeshLineMaterial({
    color: materialColors.DarkYellow,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    sizeAttenuation: 0,
    lineWidth: 0.005
  }),

  //--------MeshPhongMaterials----------
  meshPhongMaterial_NeighbouringBuildings: new MeshPhongMaterial({
    color: materialColors.SurroundingBuildings
  }),

  meshPhongMaterial_ConfiguratorSceneTower: new MeshPhongMaterial({
    color: materialColors.SecondaryExtrusion
  }),

  meshPhongMaterial_ConfiguratorSceneTowerSelected: new MeshPhongMaterial({
    color: materialColors.Extrusion
  }),

  meshPhongMaterial_ConfiguratorScenePodium: new MeshPhongMaterial({
    color: materialColors.Podium
  }),

  meshPhongMaterial_ConfiguratorScenePodiumSelected: new MeshPhongMaterial({
    color: materialColors.PodiumSelected
  }),

  meshPhongMaterial_SolvedBuilding_ST: new MeshPhongMaterial({
    color: materialColors.ST
  }),
  meshPhongMaterial_SolvedBuilding_B1: new MeshPhongMaterial({
    color: materialColors.B1
  }),
  meshPhongMaterial_SolvedBuilding_B2: new MeshPhongMaterial({
    color: materialColors.B2
  }),
  meshPhongMaterial_SolvedBuilding_B3: new MeshPhongMaterial({
    color: materialColors.B3
  }),
  meshPhongMaterial_SolvedBuilding_Circulation: new MeshPhongMaterial({
    color: materialColors.Circulation,
    opacity: 0.2,
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: 1, // These relate to z-flicker and stop the objects from overlapping
    polygonOffsetUnits: 1
  }),
  meshPhongMaterial_SolvedBuilding_Podium: new MeshPhongMaterial({
    color: materialColors.Podium
  }),
  meshPhongMaterial_SolvedBuilding_VerticalTransport: new MeshPhongMaterial({
    color: materialColors.VerticalTransport
  }),
  meshPhongMaterial_SolvedBuilding_Hovered: new MeshPhongMaterial({
    color: materialColors.Hovered
  }),
  meshPhongMaterial_SolvedBuilding_Selected: new MeshPhongMaterial({
    color: materialColors.Selected
  }),
  meshPhongMaterial_SolvedBuilding_SiteBoundary: new MeshPhongMaterial({
    color: materialColors.Zone
  }),
  meshPhongMaterial_SolvedBuilding_Extrusion: new MeshPhongMaterial({
    color: materialColors.Extrusion
  }),
  meshPhongMaterial_SolvedBuilding_G_Jr1Br: new MeshPhongMaterial({
    color: materialColors.G_Jr1Br
  }),
  meshPhongMaterial_SolvedBuilding_G_1Br: new MeshPhongMaterial({
    color: materialColors.G_1Br
  }),
  meshPhongMaterial_SolvedBuilding_G_3Br: new MeshPhongMaterial({
    color: materialColors.G_3Br
  }),
  meshPhongMaterial_SolvedBuilding_G_ST: new MeshPhongMaterial({
    color: materialColors.G_ST
  }),
  meshPhongMaterial_SolvedBuilding_G_MicroST: new MeshPhongMaterial({
    color: materialColors.G_MicroST
  }),
  meshPhongMaterial_SolvedBuilding_G_2Br: new MeshPhongMaterial({
    color: materialColors.G_2Br
  })
};
