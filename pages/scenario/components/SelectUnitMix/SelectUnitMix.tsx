import { UnitMix } from "pages/configurator/data/v2/types";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "styling/components";
import { ButtonCheckbox } from "styling/components/Button/ButtonCheckbox";
import { PercentageSlider, SliderThumb } from "styling/components/PercentageSlider/PercentageSlider";
import classes from "./SelectUnitMix.module.scss";
import { unitMixTypes } from "utils/constants";
import { debounce } from "lodash-es";
import { useSelectedPlot } from "pages/configurator/stores/buildingServiceStoreSelectors";

export const SelectUnitMix: React.FC = () => {
  const [buildingServiceStore, buildingServiceActions] = useV2BuildingServiceStore();
  const [selectedPlot] = useSelectedPlot();
  const plots = buildingServiceStore.configuration?.plots;

  const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>(
    plots && plots.length > 0 ? plots[0].id : undefined
  );

  const noUnitMixAvailable = !plots || !selectedPlot || selectedPlot.towers.length === 0;

  const unitMixesByPlotId = useMemo(() => {
    // For now, since we configure by plot instead of by tower,
    // just use the first tower's unit mix
    if (noUnitMixAvailable || !plots) {
      return null;
    } else {
      return plots.reduce(
        (o, plot) => ({
          ...o,
          [plot.id]: plot.towers.length > 0 ? plot.towers[0].unitMix : null
        }),
        {}
      );
    }
  }, [
    plots,
    plots?.[buildingServiceStore.selectedPlotIndex],
    selectedPlotId,
    buildingServiceStore.selectedPlotIndex,
    plots?.[buildingServiceStore.selectedPlotIndex]?.towers.length
  ]);

  useEffect(() => {
    if (plots && selectedPlot) {
      handlePlotSelection(buildingServiceStore.configuration!.plots[buildingServiceStore.selectedPlotIndex].id);
    }
  }, [buildingServiceStore.configuration?.plots, buildingServiceStore.selectedPlotIndex]);

  const updateUnitMixForSelectedPlotId = useCallback(
    debounce((newValues: SliderThumb[]) => {
      if (unitMixesByPlotId && selectedPlotId) {
        const updatedUnitMix = unitMixesByPlotId[selectedPlotId].map((unitMix: UnitMix) => {
          const unitMixThumb = newValues.find((thumb) => thumb.label === unitMix.type);
          return {
            type: unitMix.type,
            percentage: unitMixThumb != null ? unitMixThumb.value : unitMix.percentage
          };
        });

        buildingServiceActions.setUnitMixForPlotId(selectedPlotId, updatedUnitMix);
      }
    }, 250),
    [unitMixesByPlotId, selectedPlotId, buildingServiceActions]
  );

  const handlePlotSelection = (plotId: string) => {
    setSelectedPlotId(plotId);
    buildingServiceActions.setSelectedObjectIndexById(plotId);
  };

  const generateBuilding = useCallback(async () => {
    // Save configuration
    await buildingServiceActions.createConfiguration();

    // Generate building
    await buildingServiceActions.createFlow();
  }, [buildingServiceActions]);

  const plotOptions = useMemo(
    () =>
      plots?.map((plot) => ({
        title: plot.label,
        onClick: (): void => handlePlotSelection(plot.id),
        selected: selectedPlotId === plot.id
      })),
    [plots, selectedPlotId]
  );

  const notEmpty = (value: UnitMix | null | undefined): value is UnitMix => {
    return value !== null && value !== undefined;
  };

  const unitMixThumbs: SliderThumb[] | null = useMemo(() => {
    const unitMixes: UnitMix[] | null =
      selectedPlotId && unitMixesByPlotId && unitMixesByPlotId[selectedPlotId]
        ? unitMixesByPlotId[selectedPlotId]
        : null;

    if (!unitMixes) {
      return null;
    }

    return Object.keys(unitMixTypes)
      .map((unitMixType) => {
        return unitMixes.find((um) => um.type === unitMixType);
      })
      .filter(notEmpty)
      .map((unitMix) => {
        return {
          value: unitMix.percentage,
          label: unitMix.type,
          description: unitMixTypes[unitMix.type]
        };
      });
  }, [
    selectedPlotId,
    unitMixesByPlotId,
    buildingServiceStore.selectedPlotIndex,
    plots?.[buildingServiceStore.selectedPlotIndex]?.towers.length
  ]);

  return (
    <div className={classes.selectUnitMix}>
      {noUnitMixAvailable ? (
        <div className={classes.unavailable}>Please add a plot and tower to continue</div>
      ) : (
        <>
          {plotOptions && <ButtonCheckbox classType={"row"} objects={plotOptions} />}
          <div className={classes.slider}>
            {unitMixThumbs && (
              <PercentageSlider thumbs={unitMixThumbs} sliderValueChanged={updateUnitMixForSelectedPlotId} />
            )}
          </div>
          <Button classType="primary" onClick={generateBuilding}>
            Generate Building
          </Button>
        </>
      )}
    </div>
  );
};
