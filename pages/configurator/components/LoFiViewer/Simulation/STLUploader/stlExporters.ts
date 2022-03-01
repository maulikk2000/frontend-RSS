import { coordinate } from "pages/configurator/data/types";
import { Podium, SiteConfiguration, Tower } from "pages/configurator/data/v2/types";
import { ExtrudeGeometry, Shape, Vector2, Group, Mesh } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { createThreeJSObjectFromGeoJSONFeature, getOverpassData } from "pages/configurator/utilities/overpassUtils";
import { booleanDisjoint, polygon } from "@turf/turf";
import { feetToMetres, getVerticesFromSpine } from "pages/configurator/components/utils";

const podiumGeometry = (podium: Podium) => {
  const depth = podium.floorCount * podium.floorToFloorHeight;
  const shape = new Shape(podium.boundary.map((p) => new Vector2(p.x, p.y)));
  return new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
};

const towerGeometry = (tower: Tower) => {
  const depth = tower.floorCount * tower.floorToFloorHeight;
  const shape = new Shape(getVerticesFromSpine(tower.spine, tower.width).map((v) => new Vector2(v.x, v.y)));
  return new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
};

const contextGeometry = async (lngLat: [number, number], radius: number, excludeZone: coordinate[]) => {
  const overpassData = await getOverpassData(lngLat, radius, `"building"`);
  const excludeGeometry = polygon([excludeZone]);
  const geometries = overpassData.features
    // Ignore buildings that intersect the zone.
    .filter((feature) => booleanDisjoint(feature, excludeGeometry))
    .map((feature) =>
      createThreeJSObjectFromGeoJSONFeature(feature, lngLat, {
        bevelEnabled: false
      })
    );
  return BufferGeometryUtils.mergeBufferGeometries(geometries);
};

/**
 * Converts a site configuration to STL format. Intended to be used by simulations
 * backend therefore shapes are kept simple. No bevels or other extra details we
 * display in the viewer. Just solid blocks.
 */
export const exportConfiguration = (site: SiteConfiguration) => {
  const root = new Group();
  root.scale.multiplyScalar(feetToMetres(1));
  for (const plot of site.plots ?? []) {
    root.add(new Mesh(podiumGeometry(plot.podium)));
    const podiumHeight = plot.podium.floorCount * plot.podium.floorToFloorHeight;
    for (const tower of plot.towers) {
      const towerObj = new Mesh(towerGeometry(tower));
      towerObj.position.setZ(podiumHeight);
      root.add(towerObj);
    }
  }
  const exporter = new STLExporter();
  root.updateMatrixWorld(true); // Exporter was ignoring local transforms
  return exporter.parse(root);
};

/**
 * Converts the neighbouring buildings into STL format. Intended to be used by
 * simulations backend.
 */
export const exportContext = async (siteCoords: coordinate, excludePolygon: coordinate[]) => {
  const root = new Group();
  root.scale.multiplyScalar(feetToMetres(1));
  root.add(new Mesh(await contextGeometry(siteCoords as [number, number], 600, excludePolygon)));
  const exporter = new STLExporter();
  root.updateMatrixWorld(true);
  return exporter.parse(root);
};
