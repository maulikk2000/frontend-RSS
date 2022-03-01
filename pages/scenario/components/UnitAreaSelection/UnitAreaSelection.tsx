import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import React, { useEffect, useState, FC, useCallback } from "react";
import { Button } from "styling/components/Button/Button";
import { ButtonCheckbox, ButtonCheckboxObject } from "styling/components/Button/ButtonCheckbox";
import { DoubleRangeSlider } from "styling/components/Slider/DoubleRangeSlider/DoubleRangeSlider";
import { UnitMixOption, defaultUnitAreaData } from "./data";
import { getNameFromApartmentType } from "../../utils/apartmentUtils";
import classes from "./UnitAreaSelection.module.scss";
import { areaMultiplier, defaultMeasurementUnit } from "utils/constants";
import { debounce } from "lodash-es";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { measurementUnitDisplay } from "utils/units";
import { useSelectedWorkspace } from "stores/workspaceStore";
import shallow from "zustand/shallow";

type consolidatedAptCatalog = {
  plotId: string;
  plotLabel: string;
  unitMix: Array<UnitMixOption>;
};

interface UnitAreaRangeProps {
  onClickNext?: (stepNumber) => void;
}

interface UnitSelection {
  plotId: string;
  groupId: string;
  lowValue: number;
  highValue: number;
}

export const UnitAreaSelection: FC<UnitAreaRangeProps> = ({ onClickNext }) => {
  const stepNumber = 2;
  const [buildingStoreState, buildingStoreActions] = useV2BuildingServiceStore();

  const [configToolsMode, setConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode],
    shallow
  );

  const [plotApartmentMixes, setPlotApartmentMixes] = useState<Array<consolidatedAptCatalog>>();
  const [rangeSliderChanges, setRangeSliderChanges] = useState<Array<UnitSelection>>([]);
  const [selectedWorkspace] = useSelectedWorkspace();
  const { areaUnit } = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const minRange = 1;
  const plots = buildingStoreState.configuration?.plots;
  const plot = plots ? plots[buildingStoreState.selectedPlotIndex] : null;
  const towers = plots?.[buildingStoreState.selectedPlotIndex]?.towers;
  const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>(
    plots && plots.length > 0 ? plots[0].id : undefined
  );
  const [selectedObject, setSelectedObject] = useState(getSelectedObject(buildingStoreState));
  const defaultColor = "#CCCCCC";
  const [plotCheckboxOptions, setPlotCheckBoxOptions] = useState<Array<ButtonCheckboxObject>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const consolidateApartmentCatalogue = useCallback(() => {
    let plotCollection: Array<consolidatedAptCatalog> = [];
    buildingStoreState.configuration?.plots.forEach((plot, i) => {
      let consolApartCatObject: consolidatedAptCatalog;
      const defaultUnitMixOptions: Array<UnitMixOption> = defaultUnitAreaData.map((unitAreaData) => ({
        ...unitAreaData
      }));

      plot.towers.forEach((tower) => {
        tower.apartmentCatalog?.forEach((catalogueItem) => {
          let existingGroupSummary = defaultUnitMixOptions.find(
            (unitData) => unitData.groupId === catalogueItem.unitMixType
          );
          if (existingGroupSummary) {
            //minFrontage/maxFrontage are the default selections given by solvers
            //min/max area value is calc'd by multiplying by "magic number"
            const min = Math.round(catalogueItem.minFrontage * areaMultiplier);
            const max = Math.round(catalogueItem.maxFrontage * areaMultiplier);

            //reset the min but only if it's allowed
            if (
              min !== existingGroupSummary.min &&
              min <= existingGroupSummary.maxAllowed &&
              min >= existingGroupSummary.minAllowed
            ) {
              existingGroupSummary.min = min;
            }

            //reset the max but only if its withing the allowed
            if (
              max !== existingGroupSummary.max &&
              max <= existingGroupSummary.maxAllowed &&
              max >= existingGroupSummary.minAllowed
            ) {
              existingGroupSummary.max = max;
            }

            //they can't be the same
            if (min === max) {
              if (min - 1 > existingGroupSummary.minAllowed) {
                existingGroupSummary.min = min - 1;
              } else {
                existingGroupSummary.max = max + 1;
              }
            }
          } else {
            let newOption = {
              label: getNameFromApartmentType(catalogueItem.unitMixType),
              groupId: catalogueItem.unitMixType,
              min: Math.round(catalogueItem.minFrontage * areaMultiplier),
              max: Math.round(catalogueItem.maxFrontage * areaMultiplier),
              minAllowed: Math.round(catalogueItem.minFrontage * areaMultiplier),
              maxAllowed: Math.round(catalogueItem.maxFrontage * areaMultiplier),
              colorCode: defaultColor
            };

            defaultUnitMixOptions.push(newOption);
          }
        });
      });

      consolApartCatObject = {
        plotId: plot.id,
        plotLabel: plot.label,
        unitMix: defaultUnitMixOptions
      };

      plotCollection.push(consolApartCatObject);
    });

    setPlotApartmentMixes(plotCollection);
  }, [buildingStoreState.configuration?.plots]);

  const handlePlotSelection = useCallback(
    (plotId: string) => {
      setSelectedPlotId(plotId);
      buildingStoreActions.setSelectedObjectIndexById(plotId);
    },
    [buildingStoreActions]
  );

  useEffect(() => {
    if (buildingStoreState.configuration?.plots && buildingStoreState.configuration?.plots.length > 0) {
      handlePlotSelection(buildingStoreState.configuration?.plots[buildingStoreState.selectedPlotIndex].id!);
    }
  }, [buildingStoreState.selectedPlotIndex, buildingStoreState.configuration?.plots, handlePlotSelection]);

  const updatePlotCheckBoxOptions = useCallback(() => {
    let options: Array<ButtonCheckboxObject> = [];
    plotApartmentMixes?.forEach((plotMix) => {
      const option = {
        title: plotMix.plotLabel,
        onClick: () => {
          handlePlotSelection(plotMix.plotId);
          disableConfigTools();
        },
        selected: selectedPlotId === plotMix.plotId
      };

      options.push(option);
    });
    setPlotCheckBoxOptions(options);
  }, [handlePlotSelection, plotApartmentMixes, selectedPlotId]);

  useEffect(() => {
    consolidateApartmentCatalogue();
  }, [towers?.length, consolidateApartmentCatalogue]);

  useEffect(() => {
    if (!buildingStoreState.configuration) {
      //TODO: What do we do if the config isn't loaded?
    }
    consolidateApartmentCatalogue();
  }, [buildingStoreState.configuration, consolidateApartmentCatalogue]);

  useEffect(() => {
    updatePlotCheckBoxOptions();
  }, [plotApartmentMixes, selectedPlotId, updatePlotCheckBoxOptions]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateMinMaxArea = useCallback(
    debounce((groupId: string, lowVal: number, highVal: number) => {
      if (selectedPlotId) {
        buildingStoreActions.setMinMaxAreaForPlotId(selectedPlotId, {
          unitMixType: groupId,
          minArea: lowVal,
          maxArea: highVal
        });
      }
    }, 250),
    [selectedPlotId, buildingStoreActions]
  );

  const handleValueChange = useCallback(
    (groupId: string) => {
      return (lowVal: number, highVal: number) => {
        disableConfigTools();
        let newUnitSelections: Array<UnitSelection> = [];
        if (
          rangeSliderChanges.length &&
          rangeSliderChanges.some((selection) => selection.groupId === groupId && selection.plotId === selectedPlotId)
        ) {
          newUnitSelections = rangeSliderChanges.map((unitSelection) => {
            if (unitSelection.plotId === selectedPlotId && unitSelection.groupId === groupId) {
              return { ...unitSelection, lowValue: lowVal, highValue: highVal };
            }
            return unitSelection;
          });
        } else {
          newUnitSelections = [...rangeSliderChanges];
          newUnitSelections.push({
            groupId,
            plotId: selectedPlotId!,
            lowValue: lowVal,
            highValue: highVal
          });
        }

        setRangeSliderChanges([...newUnitSelections]);
        updateMinMaxArea(groupId, lowVal, highVal);
      };
    },
    [rangeSliderChanges, selectedPlotId, updateMinMaxArea]
  );

  const handleNextStep = async () => {
    setIsLoading(true);
    await buildingStoreActions.createConfiguration();
    setIsLoading(false);
    if (!!onClickNext) onClickNext(stepNumber);
  };

  const getNodeValue = (val: number, groupId: string, type: string) => {
    let returnVal = val;
    rangeSliderChanges.forEach((selection) => {
      if (selection.groupId === groupId && selection.plotId === selectedPlotId && type === "low") {
        returnVal = selection.lowValue;
      }
      if (selection.groupId === groupId && selection.plotId === selectedPlotId && type === "high") {
        returnVal = selection.highValue;
      }
    });
    return Math.round(returnVal);
  };

  const noAreaSelectionAvailable =
    !plots ||
    !plots[buildingStoreState.selectedPlotIndex] ||
    plots[buildingStoreState.selectedPlotIndex].towers.length === 0 ||
    (plots[buildingStoreState.selectedPlotIndex].towers.length === 1 && configToolsMode === "add");

  const disableConfigTools = () => {
    if (plot && configToolsMode === "add") {
      setConfigToolsMode("none");
      const towers = [...plot.towers];
      towers.splice(selectedObject.index!, 1);
      buildingStoreActions.setSelectedObjectIndex(
        towers.length ? "tower" : "plot",
        0,
        buildingStoreState.selectedPlotIndex
      );
      buildingStoreActions.updatePlotTowers(towers);
    }
  };

  const getPlotSliderOptions = () => {
    return (
      <>
        {plotApartmentMixes?.map((plotMix, plotMixIdx) => {
          if (plotMix.plotId !== selectedPlotId) {
            return <React.Fragment key={plotMixIdx}></React.Fragment>;
          }
          return (
            <React.Fragment key={`${plotMix.plotLabel}-${plotMixIdx}`}>
              {plotMix.unitMix.map((unitmix, i) => {
                return (
                  <div key={i} className={classes.unitMixRow}>
                    <div className={classes.labelWrapper}>
                      <span className={classes.bullet} style={{ background: unitmix.colorCode }}></span>
                      <label>{unitmix.label}</label>
                    </div>
                    <div className={classes.sliderWrapper}>
                      <DoubleRangeSlider
                        min={unitmix.minAllowed.toString()}
                        max={unitmix.maxAllowed.toString()}
                        id={unitmix.groupId}
                        lowValue={getNodeValue(unitmix.min, unitmix.groupId, "low")}
                        highValue={getNodeValue(unitmix.max, unitmix.groupId, "high")}
                        minRange={minRange}
                        onSliderValueChange={handleValueChange(unitmix.groupId)}
                        unit={measurementUnitDisplay[areaUnit]}
                      />
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className={classes.wrapper}>
      {noAreaSelectionAvailable ? (
        <div className={classes.unavailable}>Please add a plot and tower to continue</div>
      ) : (
        <div className={classes.optionWrapper}>
          <div className={classes.buttonWrapper}>
            <ButtonCheckbox classType={"row"} objects={plotCheckboxOptions} />
          </div>

          <div className={classes.slideOptionWrapper}>{getPlotSliderOptions()}</div>
          <div className={classes.buttonWrapper}>
            <Button classType="primary" onClick={handleNextStep} isLoading={isLoading}>
              <span className={classes.nextBtnLabel}>Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
