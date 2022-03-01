import { ComplianceContent } from "pages/compliance/types/types";

export const complianceContent: ComplianceContent = [
  {
    name: "Maximum Height: All Buildings",
    id: "maxHeightAllBuildings",
    layers: [
      {
        name: "Low Intensity",
        iconColor: "#EDCD7C",
        section: "(Section 3.4 Table 6)",
        link: "https://www.mountainview.gov/civicax/filebank/blobdload.aspx?BlobID=32005#page=68",
        value: "60'"
      },
      {
        name: "Medium Intensity",
        iconColor: "#EFAA7A",
        section: "(Section 3.4 Table 6)",
        link: "https://www.mountainview.gov/civicax/filebank/blobdload.aspx?BlobID=32005#page=68",
        value: "75'"
      },
      {
        name: "High Intensity",
        iconColor: "#E07A71",
        section: "(Section 3.4 Table 6)",
        link: "https://www.mountainview.gov/civicax/filebank/blobdload.aspx?BlobID=32005#page=68",
        value: "95'"
      }
    ]
  },
  {
    name: "Maximum Height: High-Rise Core",
    id: "maxHeightHighRiseCore",
    layers: [
      {
        name: "High Rise Core",
        iconColor: "#62CDE4",
        section: "(Section 3.3.1.10)",
        link: "https://www.mountainview.gov/civicax/filebank/blobdload.aspx?BlobID=32005#page=57",
        value: "135'"
      }
    ]
  }
];

export const complianceToggles = () => {
  let toggles = {};

  complianceContent.map((content) => {
    toggles = {
      ...toggles,
      [content.name]: false
    };
  });

  return toggles;
};
