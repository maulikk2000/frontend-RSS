import { ComplianceIds } from "pages/configurator/data/types";

type ComplianceLayer = {
  name: string;
  iconColor: string;
  section: string;
  link: string;
  value: string;
};

export type ComplianceContent = {
  name: string;
  id: ComplianceIds;
  layers?: ComplianceLayer[];
}[];
