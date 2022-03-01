import { Vector3 } from "three";
import {
  createNewVector,
  getBearingBetweenVectors,
  getDistanceBetweenVectors,
  pointToVector3,
  vector3ToPoint
} from "../components/utils";
import { BUILDING_MAXLENGTH, BUILDING_MAXWIDTH, BUILDING_MINLENGTH } from "../data/constants";
import { CubsPoint } from "../data/types";
import { SiteConfiguration, SiteConfigurationContract, Tower } from "../data/v2/types";

export const sanitiseBoundary = (boundary: CubsPoint[]) => {
  const vectorBoundary = boundary.map(pointToVector3);

  while (vectorBoundary[vectorBoundary.length - 1].equals(vectorBoundary[vectorBoundary.length - 2])) {
    vectorBoundary.pop();
  }

  if (!vectorBoundary[0].equals(vectorBoundary[vectorBoundary.length - 1])) {
    vectorBoundary.push(vectorBoundary[0]);
  }

  return vectorBoundary.map(vector3ToPoint);
};

export const getContractFromPlotConfiguration = (siteConfiguration: SiteConfiguration): SiteConfigurationContract => {
  let configuration = siteConfiguration as any;

  configuration.plots = siteConfiguration.plots.map((plot: any) => {
    plot.towers = plot.towers.map((tower) => {
      tower.spine = tower.spine.map(vector3ToPoint);

      return tower;
    });

    plot.podium.boundary = plot.podium.boundary.map(vector3ToPoint);
    plot.parking.boundary = plot.parking.boundary.map(vector3ToPoint);

    if (
      plot.podium.boundary[0].ptX === plot.podium.boundary[plot.podium.boundary.length - 1].ptX &&
      plot.podium.boundary[0].ptY === plot.podium.boundary[plot.podium.boundary.length - 1].ptY
    ) {
      plot.podium.boundary.pop();
    }

    if (
      plot.parking.boundary[0].ptX === plot.parking.boundary[plot.parking.boundary.length - 1].ptX &&
      plot.parking.boundary[0].ptY === plot.parking.boundary[plot.parking.boundary.length - 1].ptY
    ) {
      plot.parking.boundary.pop();
    }

    return plot;
  });

  return configuration;
};

export const getConfigurationFromPlotContract = (siteConfiguration): SiteConfiguration => {
  let configuration = siteConfiguration as any;

  configuration.plots = siteConfiguration.plots.map((plot: any) => {
    plot.towers = plot.towers.map((tower) => {
      tower.spine = tower.spine.map(pointToVector3);
      tower.width = BUILDING_MAXWIDTH;
      return tower;
    });

    plot.podium.boundary = plot.podium.boundary.map(pointToVector3);
    plot.parking.boundary = plot.parking.boundary.map(pointToVector3);

    if (
      plot.podium.boundary[0].x !== plot.podium.boundary[plot.podium.boundary.length - 1].x &&
      plot.podium.boundary[0].y !== plot.podium.boundary[plot.podium.boundary.length - 1].y
    ) {
      plot.podium.boundary.push(plot.podium.boundary[0]);
    }

    if (
      plot.parking.boundary[0].x !== plot.parking.boundary[plot.parking.boundary.length - 1].x &&
      plot.parking.boundary[0].y !== plot.parking.boundary[plot.parking.boundary.length - 1].y
    ) {
      plot.parking.boundary.push(plot.parking.boundary[0]);
    }

    return plot;
  });

  configuration.boundary = sanitiseBoundary(configuration.boundary);

  return configuration;
};

export const updateSpineFromBuildingTypology = (buildingTypology: string, tower: Tower) => {
  let spine = [...tower.spine];

  const arm1Length = getDistanceBetweenVectors([tower.spine[0], tower.spine[1]]);
  const arm1Bearing = getBearingBetweenVectors([tower.spine[0], tower.spine[1]]);

  switch (buildingTypology) {
    case "Bar":
      while (spine.length > 2) {
        spine.pop();
      }
      let newPoint = createNewVector(spine[0], arm1Bearing, arm1Length + tower.width / 2);
      return [spine[0], newPoint];

    case "LShape":
      while (spine.length > 3) {
        spine.pop();
      }
      if (spine.length === 2) {
        let arm1MaxLength = BUILDING_MAXLENGTH - tower.width / 2;
        let newPoint: Vector3;
        if (arm1Length > arm1MaxLength) {
          newPoint = createNewVector(spine[0], arm1Bearing, arm1MaxLength);
        } else {
          newPoint = createNewVector(spine[0], arm1Bearing, arm1Length - tower.width / 2);
        }
        let lastPoint = createNewVector(newPoint, arm1Bearing + 90, BUILDING_MINLENGTH);
        return [spine[0], newPoint, lastPoint];
      }
      return spine;

    default:
      return spine;
  }
};

export const updateEnvelopeScoresFromSpineLength = (tower: Tower) => {
  const envelopeScores = [...tower.envelopeScores];
  while (envelopeScores.length > tower.spine.length * 2) {
    envelopeScores.pop();
  }
  while (envelopeScores.length < tower.spine.length * 2) {
    envelopeScores.push(0);
  }

  return envelopeScores;
};

export const addPodiumToBaseConfiguration = () => {
  const podium = {
    floorToFloorHeight: 10,
    floorCount: 2,
    envelopeScores: [1, 0, 0, 0, 0, 0],
    activityMix: [
      {
        type: "Commercial",
        percentage: 10
      },
      {
        type: "Spa",
        percentage: 90
      }
    ],
    boundary: [
      {
        ptX: -187.70806884765625,
        ptY: 41.912879943847656,
        ptZ: 0,
        pointLabel: 0
      },
      {
        ptX: -258.26129150390625,
        ptY: -198.95729064941406,
        ptZ: 0,
        pointLabel: 0
      },
      {
        ptX: -48.17361068725586,
        ptY: -333.32159423828125,
        ptZ: 0,
        pointLabel: 0
      },
      {
        ptX: 3.636526346206665,
        ptY: -248.7220916748047,
        ptZ: 0,
        pointLabel: 0
      },
      {
        ptX: 27.34731674194336,
        ptY: -255.6963653564453,
        ptZ: 0,
        pointLabel: 0
      },
      {
        ptX: 91.45626068115234,
        ptY: -42.06180953979492,
        ptZ: 0,
        pointLabel: 0
      }
    ],
    sleeveDepths: [2, 2, 2, 2],
    isPodiumFlush: false
  };

  return podium;
};
