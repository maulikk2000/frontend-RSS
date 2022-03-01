import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { PlotScene } from "./Plot/PlotScene";
import { AddObject } from "../../Tools/AddObject/AddObject";
import { materialLibrary } from "utils/materialLibrary";

export const ConfiguratorScene = () => {
  const [buildingService] = useV2BuildingServiceStore();

  return (
    <>
      <AddObject />
      {buildingService.configuration!.plots.map((plot, index) => (
        <PlotScene
          key={plot.id + index}
          index={index}
          plot={plot}
          podiumMaterial={materialLibrary.meshPhongMaterial_ConfiguratorScenePodium}
          podiumSelectedMaterial={materialLibrary.meshPhongMaterial_ConfiguratorScenePodiumSelected}
          towerMaterial={materialLibrary.meshPhongMaterial_ConfiguratorSceneTower}
          towerSelectedMaterial={materialLibrary.meshPhongMaterial_ConfiguratorSceneTowerSelected}
        />
      ))}
    </>
  );
};
