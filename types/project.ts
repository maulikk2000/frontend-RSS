import { coordinate } from "pages/configurator/data/types";
import { ApiCallState } from "./common";
import { ApiCallStoreState } from "./extensions/apiCallStateExtension";
import { MessageStoreState } from "./extensions/messageExtension";
import { CompliancePlanning } from "./planning";

export type CreateProjectRequest = {
  name: string;
  address: string;
  city: string;
  state: string;
  authority: string;
  zoningDistrict: string;
  zoningLandUse: string;
  heightLimit: string;
  farLimit: string;
  siteArea: string;
  lead: string;
  siteWorldCoordinates?: coordinate;
  coordinates?: coordinate[];
  description: string;
  envelopeCoordinates?: coordinate[];
  envelopeHeight?: number;
};

export type Project = {
  id: string;
  authority: string;
  city: string;
  client: string;
  farLimit: string;
  heightLimit: string;
  lead: string;
  state: string;
  type: string;
  zoningDistrict: string;
  zoningLandUse: string;
  name: string;
  created: string;
  address: string;
  description: string;
  siteArea: string;
  status: string;
  opportunityIdentifiedDate: string;
  planningSubmissionDate: string;
  startConstructionDate: string;
  practicalCompletionDate: string;
  updated: string;
  siteWorldCoordinates: coordinate;
  envelopeCoordinates?: coordinate[];
  envelopeHeight?: number;
  coordinates?: coordinate[];
  owner: string;
};

export type ProjectAction = "DELETE" | "PATCH";

export type ProjectStoreState = MessageStoreState &
  ApiCallStoreState & {
    projects: Project[];
    selectedProjectId: string;
    activeProjectId: string;
    activeProjectAction?: ProjectAction;
    selectedProjectPlanning?: CompliancePlanning[];
    compliancePlanningDataState?: ApiCallState;
  };
