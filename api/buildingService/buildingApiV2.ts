import axios from "api/axios-eli";
import { CancelTokenSource } from "axios";
import { SiteConfigurationContract, V2CreateFlow } from "pages/configurator/data/v2/types";
import { configurationEndpoint, configurationsEndpoint, flowsEndpoint, flowTraceEndpoint } from "./buildingEndpointsV2";

export const createConfiguration = async (configurationContract: SiteConfigurationContract): Promise<any> => {
  let rawConfigurationResponse = axios.post(`${configurationsEndpoint()}`, JSON.stringify(configurationContract), {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return (await rawConfigurationResponse).data;
};

export const getConfiguration = async (scenarioId: string): Promise<any> => {
  let rawConfigurationResponse = await axios.get(configurationEndpoint(scenarioId));

  return rawConfigurationResponse.data;
};

export const createFlow = async (
  createBuildingRequest: V2CreateFlow,
  cancelSource: CancelTokenSource
): Promise<any> => {
  let rawFlowResponse = axios.post(`${flowsEndpoint()}`, JSON.stringify(createBuildingRequest), {
    headers: {
      "Content-Type": "application/json"
    },
    cancelToken: cancelSource.token
  });
  return (await rawFlowResponse).data;
};

export const getFlowTrace = async (flowId: string): Promise<any> => {
  let rawFlowResponse = await axios.get(flowTraceEndpoint(flowId));

  return rawFlowResponse;
};
