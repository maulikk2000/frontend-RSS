import { SunExposureCategory } from "types/simulation";
import { AnalysisMesh } from "./ModelData";

export const sunExposureCategoryToValueId: Record<SunExposureCategory, string> = {
  "Annual Average Daily Sunlight Hours": "Average Daily Sunlight Hours (Hrs)",
  "Annual Hours in the Shade": "Hours in Shade (Hrs)",
  "Annual Potential Sunlight Hours": "Total Potential Sunlight Hours (Hrs)",
  "Winter Daily Sunlight Hours": "Winter Daily Sunlight Hours (Hrs)",
  "Winter Potential Sunlight hours": "Winter Potential Sunlight Hours (Hrs)"
};

const valueIdToSunExposureCategory: Record<string, SunExposureCategory> = {
  "Average Daily Sunlight Hours (Hrs)": "Annual Average Daily Sunlight Hours",
  "Hours in Shade (Hrs)": "Annual Hours in the Shade",
  "Total Potential Sunlight Hours (Hrs)": "Annual Potential Sunlight Hours",
  "Winter Daily Sunlight Hours (Hrs)": "Winter Daily Sunlight Hours",
  "Winter Potential Sunlight Hours (Hrs)": "Winter Potential Sunlight hours"
};

export const getMinMaxForSolar = (analysisMeshes: AnalysisMesh[]) => {
  const resultCases = analysisMeshes.map((mesh) => mesh.resultCases.find((x) => x.name === "Sun Exposure"));
  const valueArrays = resultCases.flatMap((resultCase) =>
    resultCase?.pointDataArrays.map((pointDataArray) => ({
      name: pointDataArray.name,
      values: pointDataArray.values
    }))
  );

  const minMaxPerCategory: Record<SunExposureCategory, { min: number; max: number }> = {
    "Annual Average Daily Sunlight Hours": { min: 0, max: 0 },
    "Annual Hours in the Shade": { min: 0, max: 0 },
    "Annual Potential Sunlight Hours": { min: 0, max: 0 },
    "Winter Daily Sunlight Hours": { min: 0, max: 0 },
    "Winter Potential Sunlight hours": { min: 0, max: 0 }
  };

  for (const valueArray of valueArrays) {
    if (!valueArray) {
      continue;
    }

    const sunExposureCategory = valueIdToSunExposureCategory[valueArray.name];
    if (!sunExposureCategory) {
      continue;
    }

    const minMax = minMaxPerCategory[sunExposureCategory];
    let min = minMax?.min;
    let max = minMax?.max;

    for (const v of valueArray.values) {
      if (v !== null) {
        min = min == null ? v : Math.min(min, v);
        max = max == null ? v : Math.max(max, v);
      }
    }

    minMaxPerCategory[sunExposureCategory] = { min, max };
  }

  return minMaxPerCategory;
};
