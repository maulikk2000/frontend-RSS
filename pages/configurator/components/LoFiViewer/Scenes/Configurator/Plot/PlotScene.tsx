import React from "react";

import { Plot } from "pages/configurator/data/v2/types";
import { MeshPhongMaterial } from "three";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { CONFIGURATOR_STATE } from "pages/configurator/data/enums";
import { PodiumModel } from "./Podium/PodiumModel";
import { TowerModel } from "./Towers/TowerModel";
import { useSimulationStore } from "stores/simulationStore";

type Props = {
  plot: Plot;
  index: number;
  towerMaterial: MeshPhongMaterial;
  towerSelectedMaterial: MeshPhongMaterial;
  podiumMaterial: MeshPhongMaterial;
  podiumSelectedMaterial: MeshPhongMaterial;
};

export const PlotScene = ({
  plot,
  index,
  podiumMaterial,
  podiumSelectedMaterial,
  towerMaterial,
  towerSelectedMaterial
}: Props) => {
  const [buildingService] = useV2BuildingServiceStore();
  const [, simulationStateActions] = useSimulationStore();

  const buildingIsUnsolved = !(buildingService.building && buildingService.status === CONFIGURATOR_STATE.SOLVED);

  const viewingSimulation = simulationStateActions.viewingSimulation();

  const showTowers = buildingIsUnsolved || viewingSimulation;

  return (
    <>
      <PodiumModel plot={plot} plotIndex={index} material={podiumMaterial} selectedMaterial={podiumSelectedMaterial} />

      {showTowers &&
        plot.towers.map((tower, towerIndex) => (
          <TowerModel
            key={towerIndex}
            tower={tower}
            towerIndex={towerIndex}
            plotIndex={index}
            podium={plot.podium}
            material={towerMaterial}
            selectedMaterial={towerSelectedMaterial}
          />
        ))}
    </>
  );
};
