import { useEffect, useState } from "react";
import { button, useControls } from "leva";
import { Group, Vector2, Vector3 } from "three";
import { BoundaryRenderer } from "api/floorplateService/grpcClient";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { feetToMetres, metresToFeet, vector3ToVector2 } from "../../utils";
import { useSelectedPlot, useSelectedTower } from "pages/configurator/stores/buildingServiceStoreSelectors";
import { FPLRequestBuilder } from "api/floorplateService/grpcClient/requestBuilders";

const loadFloorPlate = (spine: Vector2[], corridorWidth: number, apartmentDepth: number, solveApartments: boolean) => {
  const spineMetres = spine.map((v) => v.clone().multiplyScalar(feetToMetres(1)));

  const renderer = new BoundaryRenderer("https://transport-api-test-branch-pn3dijyhcq-ts.a.run.app");
  const grpcRoot = new Group();
  const floorplate = new Group();
  const apartment = new Group();
  apartment.position.z = 0.01;
  grpcRoot.add(floorplate, apartment);
  const floorPlateRequest = new FPLRequestBuilder({
    spinePoints: spineMetres,
    corridorWidth: feetToMetres(corridorWidth),
    apartmentDepth: feetToMetres(apartmentDepth),
    layoutConfiguration: "floorplate"
  }).getRequestMessage();

  const apartmentRequest = new FPLRequestBuilder({
    spinePoints: spineMetres,
    corridorWidth: feetToMetres(corridorWidth),
    apartmentDepth: feetToMetres(apartmentDepth),
    layoutConfiguration: "apartment"
  }).getRequestMessage();

  // The original grpc code was creating a canvas and injecting the loaded floorplate into it. We want
  // to attach it to our existing scene though. Im creating a Group and giving it to the BoundaryRenderer
  // as if it was the scene.
  const fakeCanvas1 = { scene: floorplate, ready: true };
  const fakeCanvas2 = { scene: apartment, ready: true };
  if (spineMetres.length >= 2) {
    renderer.loadFloorPlate(floorPlateRequest, fakeCanvas1);
    if (solveApartments) {
      renderer.loadFloorPlate(apartmentRequest, fakeCanvas2);
    }
  }

  // Scaling by < 1 to stop z-fighting against massing. Just for demoing floorplate overlayed on massing
  floorplate.scale.multiplyScalar(metresToFeet(0.999));
  apartment.scale.multiplyScalar(metresToFeet(0.999));

  return grpcRoot;
};

export const FloorplateLoader = () => {
  const isDrawingFloorplate = useConfiguratorToolsStore(
    (state) => state.addObjectType === "gRPC" && state.mode === "add"
  );
  const [selectedTower] = useSelectedTower();
  const [selectedPlot] = useSelectedPlot();
  const [zPosition, setZPosition] = useState<number>(0);

  const freeHandDrawSpine = () => {
    setControls({ solveSelectedTower: false });
    useConfiguratorToolsStore.setState({
      addObjectType: "gRPC",
      mode: "add"
    });
  };

  const [
    { floorHeight, corridorWidth, apartmentDepth, solveApartments, solveSelectedTower },
    setControls
  ] = useControls(
    "Floor Plate",
    () => ({
      floorHeight: 30,
      corridorWidth: 5,
      apartmentDepth: 23,
      solveApartments: false,
      solveSelectedTower: false,
      ...(!isDrawingFloorplate && {
        draw: button(freeHandDrawSpine)
      }),
      isDrawing: {
        render: () => isDrawingFloorplate,
        value: "draw floorplate in view",
        label: <span style={{ fontWeight: "bold", color: "red" }}>Now Drawing</span>
      }
    }),
    { collapsed: false },
    [isDrawingFloorplate]
  );

  const [spineVecs, setSpineVecs] = useState<Vector2[]>([]);

  useEffect(() => {
    if (!solveSelectedTower) {
      return useConfiguratorToolsStore.subscribe(
        (drawnVertices: Vector3[]) => setSpineVecs(drawnVertices.map(vector3ToVector2)),
        (state) => state.drawnVertices
      );
    }
  }, [solveSelectedTower]);

  useEffect(() => {
    if (!solveSelectedTower || !selectedTower || !selectedPlot) {
      return;
    }

    const { podium } = selectedPlot;
    const podiumHeight = podium.floorCount * podium.floorToFloorHeight;
    setZPosition(podiumHeight);

    const { floorCount, floorToFloorHeight } = selectedTower;
    const floorHeight = floorCount * floorToFloorHeight;
    setControls({ floorHeight });
    setSpineVecs(selectedTower.spine.map(vector3ToVector2));
  }, [solveSelectedTower, selectedTower?.spine, selectedTower?.floorCount, selectedPlot]);

  const [root, setRoot] = useState(() => loadFloorPlate(spineVecs, corridorWidth, apartmentDepth, solveApartments));

  useEffect(() => {
    setRoot(loadFloorPlate(spineVecs, corridorWidth, apartmentDepth, solveApartments));
  }, [spineVecs, corridorWidth, apartmentDepth, solveApartments]);

  // need to sort out later, multiples height by corridor width
  const scaleFactor = floorHeight / corridorWidth;

  return <primitive scale={new Vector3(1, 1, scaleFactor)} object={root} position-z={zPosition} />;
};
