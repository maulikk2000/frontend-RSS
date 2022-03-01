import React, { PropsWithChildren, useEffect } from "react";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ConfiguratorObjects, getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { ButtonCheckbox, ButtonCheckboxObject } from "styling/components/Button/ButtonCheckbox";
import classes from "./SiteTabs.module.scss";

export type Tab = "scenario" | "plot" | "tower";

type Props = {
  tabs: Tab[];
  selectedTab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  actionTabs?: boolean;
};
export const SiteTabs = ({ tabs, selectedTab, setTab, actionTabs = true, children }: PropsWithChildren<Props>) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();

  const selectedObject = getSelectedObject(buildingService);

  const setSelectedObject = (object: ConfiguratorObjects, index: number | null, plotIndex: number) => {
    buildingServiceActions.setSelectedObjectIndex(object, index, plotIndex);
  };

  const setSelectedTab = (tab: Tab) => {
    setTab(tab);

    if (!actionTabs) {
      return;
    }
    let towerIndex: number | null = null;
    let plotIndex: number | null = buildingService.selectedPlotIndex;
    if (tab === "tower") {
      towerIndex = selectedObject.index ?? buildingService.selectedObjectIndex ?? 0;
    }
    if (tab === "scenario") {
      plotIndex = null;
      buildingServiceActions.clearSelectedObject();
    }
  };

  useEffect(() => {
    if (!actionTabs) {
      return;
    }
    if (buildingService.selectedObjectIndex !== null) {
      let selectedObject = getSelectedObject(buildingService);
      if (selectedObject.object === "tower") {
        setSelectedTab("tower");
      } else if (selectedObject.object === "podium" || selectedObject.object === "plot") {
        setSelectedTab("plot");
      }
    } else {
      setSelectedTab("scenario");
    }
  }, [buildingService.selectedObjectIndex, buildingService.selectedPlotIndex]);

  const tabCheckboxOptions: ButtonCheckboxObject[] = [];

  tabs.map((tabName) => {
    const object: ButtonCheckboxObject = {
      title: tabName,
      onClick: () => setSelectedTab(tabName),
      selected: selectedTab === tabName
    };
    tabCheckboxOptions.push(object);
    return tabName;
  });

  const plotCheckboxOptions: ButtonCheckboxObject[] = [];

  type TowerOption = {
    plotName: string;
    options: ButtonCheckboxObject[];
  };

  const towerOptions: Array<TowerOption> = [];

  if (!buildingService.configuration && !buildingService.building) {
    return null;
  }

  let plots: any = buildingService.building ? buildingService.building.plots : buildingService.configuration!.plots;

  plots.map((plot, plotIndex) => {
    const object: ButtonCheckboxObject = {
      title: plot.label,
      onClick: () => setSelectedObject("plot", null, plotIndex),
      selected: (selectedObject.plotIndex ?? buildingService.selectedPlotIndex) === plotIndex
    };
    plotCheckboxOptions.push(object);

    const options: Array<ButtonCheckboxObject> = [];
    let towers: any = plot.building ? plot.building.towers : plot.towers;
    towers.map((tower, towerIndex) => {
      const object: ButtonCheckboxObject = {
        title: `${towerIndex + 1}`,
        onClick: () => setSelectedObject("tower", towerIndex, plotIndex),
        selected:
          (selectedObject.plotIndex ?? buildingService.selectedPlotIndex) === plotIndex &&
          (selectedObject.index ?? buildingService.selectedObjectIndex ?? 0) === towerIndex
      };
      options.push(object);
    });
    towerOptions.push({ plotName: plot.label.toString(), options });
    return plot;
  });

  return (
    <>
      <div className={classes.tabBanner}>
        {tabCheckboxOptions.map((option, i) => (
          <div
            key={i}
            className={option.title === selectedTab ? `${classes.tab} ${classes.selected}` : classes.tab}
            onClick={() => setSelectedTab(option.title as Tab)}
          >
            {option.title}
          </div>
        ))}
      </div>
      <div className={classes.tabContent}>
        <div className={classes.contentWrapper}>
          <div className={classes.tabActions}>
            {selectedTab === "plot" && <ButtonCheckbox classType={"row"} objects={plotCheckboxOptions} />}

            {tabs.includes("tower") && selectedTab === "tower" && (
              <div className={classes.towerOptionWrapper}>
                {towerOptions.map((plot, i) => (
                  <div className={classes.plotTowers} key={i}>
                    <span className={classes.plotHeader}>{plot.plotName}</span>
                    <ButtonCheckbox classType={"secondary"} objects={plot.options} />
                  </div>
                ))}
              </div>
            )}

            {selectedTab !== "scenario" && <div className={classes.buffer} />}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};
