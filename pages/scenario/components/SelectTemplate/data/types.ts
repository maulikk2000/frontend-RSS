export type SelectTemplateOption = {
  id: string;
  name: string;
  isDisabled: boolean;
  icon?: any;
  tooltip: string;
};

export const eastWhismanTemplateSmall = "844";
export const eastWhismanTemplateLarge = "913";
export const selectTemplateOptions = (workspace: string): Array<SelectTemplateOption> => {
  if (workspace === "East Whisman") {
    return [
      {
        id: "844",
        name: "Small Building Footprint",
        isDisabled: false,
        icon: "SmallBuildingFootprint",
        tooltip: "Low site coverage ratio with a mixed tower configuration."
      },
      {
        id: "913",
        name: "Larger Building Footprint",
        isDisabled: false,
        icon: "LargerBuildingFootprint",
        tooltip: "High site coverage ratio with a mixed tower configuration."
      },
      {
        id: "000",
        name: "Custom Massing",
        isDisabled: false,
        icon: "CustomMassing",
        tooltip: ""
      }
    ];
  } else {
    return [
      {
        id: "000",
        name: "Custom Massing",
        isDisabled: false,
        icon: "CustomMassing",
        tooltip: ""
      }
    ];
  }
};
