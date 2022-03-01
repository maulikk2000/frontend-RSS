import { nanoid } from "nanoid";
import { useState } from "react";
import { Tower, Podium } from "../../pages/configurator/data/v2/types";
import { useV2BuildingServiceStore } from "../../pages/configurator/stores/buildingServiceStoreV2";
import { UnknownNode, Node, useNode, useNodes, useNodeStore } from ".";

type PodiumNode = Node<"Podium", Podium>;
const isPodiumNode = (node?: UnknownNode): node is PodiumNode => node?.type === "Podium";

type TowerNode = Node<"Tower", Tower>;
const isTowerNode = (node?: UnknownNode): node is TowerNode => node?.type === "Tower";

export const useStoreConfigInNodeStore = () => {
  const [, nodeActions] = useNodeStore();
  const [buildingService] = useV2BuildingServiceStore();
  const [isDone, setIsDone] = useState(false);

  if (!buildingService.configuration || isDone) {
    return;
  }

  buildingService.configuration.plots.forEach((plot) => {
    const podiumNode: PodiumNode = {
      id: nanoid(),
      data: plot.podium,
      type: "Podium"
    };
    nodeActions.setNode(podiumNode);

    plot.towers.forEach((tower) => {
      const towerNode: TowerNode = {
        id: nanoid(),
        data: tower,
        type: "Tower"
      };
      nodeActions.setNode(towerNode, podiumNode.id);
    });
  });

  setIsDone(true);
};

const useSomeExampleNodeQueryHook = () => {
  const [node] = useNode("testing123");
  if (isPodiumNode(node)) {
    console.log(node.data.boundary);
  }

  const [nodes] = useNodes();
  const towerNodes = nodes.filter(isTowerNode);
  for (const towerNode of towerNodes) {
    console.log(towerNode.data.floorCount);
  }
};
