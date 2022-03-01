import axios from "api/axios-eli";
import { CompliancePlanning } from "types/planning";
import { complianceData } from "./planningEndpoints";

export const getComplianceData = async (userGroupName: string): Promise<CompliancePlanning[]> => {
  const rawComplianceResponse = await axios.get(complianceData(userGroupName));

  return rawComplianceResponse.data;
};
