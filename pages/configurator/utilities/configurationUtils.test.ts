import { createDefaultPodium, createDefaultParking, createDefaultTower } from "./configurationUtils";

jest.mock("three.meshline", () => {});

describe("create podium test", () => {
  it("returns a valid podium", () => {
    const podium = createDefaultPodium();

    expect(podium).toHaveProperty("floorToFloorHeight");
    expect(podium).toHaveProperty("floorCount");
    expect(podium).toHaveProperty("envelopeScores");
    expect(podium).toHaveProperty("activityMix");
    expect(podium.activityMix[0]).toHaveProperty("type");
    expect(podium.activityMix[0]).toHaveProperty("percentage");
    expect(podium).toHaveProperty("boundary");
    expect(podium.boundary[0]).toHaveProperty("x");
    expect(podium.boundary[0]).toHaveProperty("y");
    expect(podium.boundary[0]).toHaveProperty("z");
    expect(podium).toHaveProperty("sleeveDepths");
    expect(podium).toHaveProperty("isPodiumFlush");
  });
});

describe("create parking test", () => {
  it("returns a valid parking ", () => {
    const podium = createDefaultPodium();
    const parking = createDefaultParking(podium.boundary);

    expect(parking).toHaveProperty("floorToFloorHeight");
    expect(parking).toHaveProperty("floorCount");
    expect(parking).toHaveProperty("stallWidth");
    expect(parking).toHaveProperty("stallDepth");
    expect(parking).toHaveProperty("aisleWidth");
    expect(parking).toHaveProperty("boundary");
    expect(parking.boundary[0]).toHaveProperty("x");
    expect(parking.boundary[0]).toHaveProperty("y");
    expect(parking.boundary[0]).toHaveProperty("z");
  });
});

describe("create tower test", () => {
  it("returns a valid tower ", () => {
    const tower = createDefaultTower();

    expect(tower).toHaveProperty("floorToFloorHeight");
    expect(tower).toHaveProperty("floorCount");
    expect(tower).toHaveProperty("envelopeScores");
    expect(tower).toHaveProperty("unitMix");
    expect(tower.unitMix[0]).toHaveProperty("type");
    expect(tower.unitMix[0]).toHaveProperty("percentage");
    expect(tower).toHaveProperty("facade");
    expect(tower).toHaveProperty("facade.designPreset");
    expect(tower).toHaveProperty("zOffset");
    expect(tower).toHaveProperty("marketTypology");
    expect(tower).toHaveProperty("developmentProductTypology");
    expect(tower).toHaveProperty("verticalTransportStrategy");
    expect(tower).toHaveProperty("buildingTypology");
    expect(tower).toHaveProperty("width");
  });
});
