import { useEffect, useMemo, useRef } from "react";
import { useSimulationStore } from "stores/simulationStore";
import { Object3D } from "three";
import { Colour, multiColourGradient } from "../Simulation/ModelViewer/ColourFunction";
import { ModelViewer } from "../Simulation/ModelViewer/ModelViewer";
import { getMinMaxForSolar, sunExposureCategoryToValueId } from "../Simulation/ModelViewer/solarDataUtils";

const hexToColour = (hex: string): Colour => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    return [r, g, b];
  }
  return [0, 0, 0];
};

export const SunlightViewer = () => {
  const model = useRef<Object3D>(null);
  const [simulationStore, simulationActions] = useSimulationStore();

  const data = simulationStore.selectedSimulationAnalysis?.data;

  const valueId = useMemo(() => sunExposureCategoryToValueId[simulationStore.selectedSunExposureCategory], [
    simulationStore.selectedSunExposureCategory
  ]);

  const minMax = useMemo(
    () => simulationStore.minMaxPerSunExposureCategory?.[simulationStore.selectedSunExposureCategory],
    [simulationStore.minMaxPerSunExposureCategory, simulationStore.selectedSunExposureCategory]
  );

  const colours = useMemo(() => {
    return multiColourGradient(
      minMax?.min,
      minMax?.max,
      [
        hexToColour("#4C62AD"),
        hexToColour("#6395D0"),
        hexToColour("#7DBDE0"),
        hexToColour("#FFDB7D"),
        hexToColour("#F3AF48"),
        hexToColour("#CB670E")
      ],
      hexToColour("#000000")
    );
  }, [minMax]);

  useEffect(() => {
    if (!model.current) {
      return;
    }
    const feetToMetres = 3.28;
    model.current.scale.set(feetToMetres, feetToMetres, feetToMetres);
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const minMax = getMinMaxForSolar(data.analysisMeshes);
    simulationActions.setMinMaxPerSunExposureCategory(minMax);
  }, [data, simulationActions, valueId]);

  return data ? (
    <ModelViewer data={data} resultId="Sun Exposure" valueId={valueId} colourFunction={colours} ref={model} />
  ) : null;
};
