import { Object3D, EdgesGeometry, Mesh, BufferGeometry } from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { CONFIGURATOR_STATE } from "../data/enums";
import { BuildingGeometries } from "../data/v2/types";
import { MessageState } from "types/extensions/messageExtension";
import { BuildingV2 } from "../data/v2/buildingDatav2";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { useRapidMutableStore } from "../stores/zustand/rapidMutables";

// This is where we capture the progress of the solvers
const onProgress = (progressEvent: any, index: number, geometries: BuildingGeometries) => {
  let loadStatus = 0;
  if (index > 1) {
    loadStatus =
      (100 / geometries.data.length) * (index - 1) +
      ((progressEvent.loaded / progressEvent.total) * 100) / geometries.data.length;
  } else {
    loadStatus = ((progressEvent.loaded / progressEvent.total) * 100) / geometries.data.length;
  }
  useRapidMutableStore.setState({ gltfLoadPercentage: loadStatus });
};

// Here is the magic - this function takes any three.js loader and returns a promisifiedLoader
export const promisifyLoader = (loader, onProgress?) => {
  const promiseLoader = (url) => {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, onProgress, reject);
    });
  };

  return {
    originalLoader: loader,
    load: promiseLoader
  };
};

export const loadAndStoreGLTFsAsObjects = async (
  geometries: BuildingGeometries,
  building: BuildingV2,
  setState: any
) => {
  let objects: Array<Object3D> = [];
  let index = 1;

  // This is where we create promises out of the threeJS loader
  const GLTFPromiseLoader = promisifyLoader(new GLTFLoader(), (progressEvent) =>
    onProgress(progressEvent, index, geometries)
  );

  const buildingEntities = createBuildingEntityDict(building);

  if (geometries) {
    for (let solver of geometries.data) {
      // Load and Add each GLTF
      const addGLTFToArray = async (gltf: GLTF) => {
        mergeGLTFGeometriesIntoObject(gltf, objects, buildingEntities);
        return gltf;
      };
      if (solver) {
        // Wait for the promises to complete before attempting to load the next
        try {
          let loadedObject: any = await GLTFPromiseLoader.load(solver.geometry.url);

          addGLTFToArray(loadedObject);
        } catch (error) {
          let errorMessage: MessageState = {
            text: "There was an error loading the GLTF",
            variant: "error"
          };

          setState({
            message: errorMessage,
            status: CONFIGURATOR_STATE.EDIT
          });
        }
      } else {
        let errorMessage: MessageState = {
          text: "There was an error retreiving the geometries",
          variant: "error"
        };

        setState({
          message: errorMessage,
          status: CONFIGURATOR_STATE.EDIT
        });
      }
      index = index + 1;
    }
  }

  setState({
    status: CONFIGURATOR_STATE.SOLVED
  });

  useRapidMutableStore.setState({ gltfLoadPercentage: null });

  return objects;
};

const mergeAndAddGeometries = (geometries: BufferGeometry[], name: string, objects: Object3D[]) => {
  if (geometries.length > 0) {
    const object = new Object3D();
    object.name = name;
    object.userData.name = name;

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    object.children.push(new Mesh(mergedGeometry));
    objects.push(object);
  }
};

const mergeAndCreateLines = (geometries: BufferGeometry[]): BufferGeometry => {
  const mergedGeometries = BufferGeometryUtils.mergeBufferGeometries(geometries);

  const geometry: BufferGeometry = mergedGeometries;

  return new EdgesGeometry(geometry);
};

export const mergeGLTFGeometriesIntoObject = (
  gltf: GLTF,
  objects: Object3D[],
  buildingEntities: BuildingEntityDictionary
) => {
  const apartmentsObject = new Object3D();
  apartmentsObject.userData.name = "Apartments";
  const apartmentLines = new Object3D();
  apartmentLines.userData.name = "Apartments";
  apartmentLines.userData.isLines = true;

  const corrGeometries: BufferGeometry[] = [];
  const vtGeometries: BufferGeometry[] = [];
  const siteBoundaryGeometries: BufferGeometry[] = [];

  const verticalTLines = new Object3D();
  verticalTLines.userData.name = "VerticalTransport";
  verticalTLines.userData.isLines = true;

  gltf.scene.children.map((mesh: Object3D) => {
    const entity = buildingEntities[mesh.userData.gltfExtensions.name];

    if (!entity) {
      return mesh;
    }

    switch (entity.type) {
      case "Apartment":
        mesh.userData.apartment = entity.object;
        mesh.userData.plotIndex = entity.plotIndex;
        mesh.userData.towerIndex = entity.towerIndex;
        mesh.userData.unitMixType = entity.object.unitMixType;
        apartmentsObject.children.push(mesh);
        break;

      case "Corridors":
        mesh.userData.plotIndex = entity.plotIndex;
        mesh.userData.towerIndex = entity.towerIndex;
        corrGeometries.push(mesh["geometry"]);
        break;

      case "VerticalTransport":
        mesh.userData.plotIndex = entity.plotIndex;
        mesh.userData.towerIndex = entity.towerIndex;
        vtGeometries.push(mesh["geometry"]);
        break;

      case "Boundary":
        mesh.userData.plotIndex = entity.plotIndex;
        mesh.userData.towerIndex = entity.towerIndex;
    }
    return mesh;
  });

  if (apartmentsObject.children.length !== 0) {
    const apartmentLinesGeometry = mergeAndCreateLines(apartmentsObject.children.map((mesh) => mesh["geometry"]));
    apartmentLines.children.push(new Mesh(apartmentLinesGeometry));
  }

  if (vtGeometries.length !== 0) {
    const verticalTLinesGeometry = mergeAndCreateLines(vtGeometries);
    verticalTLines.children.push(new Mesh(verticalTLinesGeometry));
  }

  mergeAndAddGeometries(corrGeometries, "Corridors", objects);
  mergeAndAddGeometries(siteBoundaryGeometries, "Boundary", objects);
  mergeAndAddGeometries(vtGeometries, "VerticalTransport", objects);

  objects.push(apartmentsObject);
  objects.push(apartmentLines);
  objects.push(verticalTLines);

  return objects;
};

type BuildingEntityType = {
  type: string;
  group: string;
  plotIndex: number;
  towerIndex: number | null;
  object: any;
  createLineGeometry: boolean;
  createMergedGeometry: boolean;
};
type BuildingEntityDictionary = { [id: string]: BuildingEntityType };
export const createBuildingEntityDict = (buildingV2: BuildingV2) => {
  const buildingEntities: BuildingEntityDictionary = {};

  let plotIndex = 0;

  const entity: BuildingEntityType = {
    type: "Boundary",
    group: "Boundary",
    object: buildingV2.boundary,
    plotIndex: 0,
    towerIndex: 0,
    createLineGeometry: true,
    createMergedGeometry: true
  };
  buildingEntities[buildingV2.boundary.id] = entity;

  for (const plot of buildingV2.plots) {
    let towerIndex = 0;

    if (plot.building.podium) {
      for (const podiumSpaces of plot.building.podium.spaces) {
        if (podiumSpaces) {
          const entity: BuildingEntityType = {
            type: podiumSpaces.spaceType,
            group: podiumSpaces.spaceType,
            object: podiumSpaces,
            plotIndex: plotIndex,
            towerIndex: null,
            createLineGeometry: true,
            createMergedGeometry: true
          };
          buildingEntities[podiumSpaces.id] = entity;
        }
      }
    }
    for (const tower of plot.building.towers) {
      for (const towerSpaces of tower.spaces) {
        const entity: BuildingEntityType = {
          type: towerSpaces.spaceType,
          group: towerSpaces.spaceType,
          object: towerSpaces,
          plotIndex: plotIndex,
          towerIndex: towerIndex,
          createLineGeometry: true,
          createMergedGeometry: true
        };
        buildingEntities[towerSpaces.id] = entity;
      }
      for (const towerApartments of tower.apartments) {
        const entity: BuildingEntityType = {
          type: "Apartment",
          group: towerApartments.unitMixType,
          object: towerApartments,
          plotIndex: plotIndex,
          towerIndex: towerIndex,
          createLineGeometry: true,
          createMergedGeometry: true
        };
        if (!towerApartments.apartmentType || !towerApartments.unitMixType) {
          entity.group = "Shop2Br";
          entity.object = {
            id: "apartment-id-missing",
            unitMixType: "Shop2Br",
            apartmentType: "Shop2Br"
          };
        }
        buildingEntities[towerApartments.id] = entity;
      }
      for (const towerVerticalTransport of tower.verticalTransport) {
        const entity: BuildingEntityType = {
          type: towerVerticalTransport.type,
          group: towerVerticalTransport.type,
          object: towerVerticalTransport,
          plotIndex: plotIndex,
          towerIndex: towerIndex,
          createLineGeometry: true,
          createMergedGeometry: true
        };
        buildingEntities[towerVerticalTransport.id] = entity;
      }
      towerIndex += 1;
    }

    plotIndex += 1;
  }

  return buildingEntities;
};

export const GLTFJsonToUrl = (GLTFJson) => {
  const blob = new Blob([GLTFJson], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return url;
};
