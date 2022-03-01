import { FC, useState, useCallback } from "react";
import { SimulationAnalysisResultsOptions } from "../SimulationAnalysisResultsOptions/SimulationAnalysisResultsOptions";
import classes from "./SolarAnalysisResultsOptions.module.scss";
import { RadioButton } from "styling/components/RadioButton/RadioButton";
import { RadioGroup } from "@material-ui/core";
import { Toggle } from "styling/components";
import { useSimulationStore } from "stores/simulationStore";
import { SunExposureCategory } from "types/simulation";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";

export const SolarAnalysisResultsOptions: FC = () => {
  const [simulationStore, simulationActions] = useSimulationStore();
  const [mapSettingsStore, mapSettingsActions] = useMapSettingsStore();

  const [sunExposureCategory, setSunExposureCategory] = useState<SunExposureCategory>(
    simulationStore.selectedSunExposureCategory
  );

  const [surroundingBuildings, setSurroundingBuildings] = useState(mapSettingsStore.showNeighbouringBuildings);

  const handleSunExposureCategorySelected = useCallback(
    (event) => {
      const sunExposureCategory = event.target.value as SunExposureCategory;
      setSunExposureCategory(sunExposureCategory);
      simulationActions.setSelectedSunExposureCategory(sunExposureCategory);
    },
    [simulationActions]
  );

  const handleSurroundingBuildingsToggled = useCallback(
    (event) => {
      const show = event.target.checked;
      setSurroundingBuildings(show);
      mapSettingsActions.setShowNeighbouringBuildings(show);
    },
    [mapSettingsActions]
  );

  const legendMinMax = simulationStore.minMaxPerSunExposureCategory?.[simulationStore.selectedSunExposureCategory];

  return (
    <SimulationAnalysisResultsOptions>
      <div className={classes.container}>
        <h1>Solar Analysis</h1>
        <div className={classes.cards}>
          <div className={classes.card}>
            <div className={classes.cardToggle}>
              <h2>Toggle surrounding buildings</h2>
              <div className={classes.toggle}>
                <Toggle onChange={handleSurroundingBuildingsToggled} toggle={surroundingBuildings} title="" />
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <h2>Sun Exposure Categories</h2>
            <div className={classes.description}>Select the Sun exposure category</div>
            <div className={classes.options}>
              <RadioGroup value={sunExposureCategory} onChange={handleSunExposureCategorySelected}>
                <RadioButton label="Annual Average Daily Sunlight Hours" value="Annual Average Daily Sunlight Hours" />
                <RadioButton label="Annual Hours in the Shade" value="Annual Hours in the Shade" />
                <RadioButton label="Annual Potential Sunlight Hours" value="Annual Potential Sunlight Hours" />
                <RadioButton label="Winter Daily Sunlight Hours" value="Winter Daily Sunlight Hours" />
                <RadioButton label="Winter Potential Sunlight hours" value="Winter Potential Sunlight hours" />
              </RadioGroup>
            </div>
          </div>
        </div>
        {legendMinMax && (
          <div className={classes.legend}>
            <h3>{simulationStore.selectedSunExposureCategory}</h3>
            <div className={classes.colourBar}></div>
            <div className={classes.labels}>
              <div>{legendMinMax.min}</div>
              <div>{legendMinMax.max}</div>
            </div>
          </div>
        )}
      </div>
    </SimulationAnalysisResultsOptions>
  );
};
