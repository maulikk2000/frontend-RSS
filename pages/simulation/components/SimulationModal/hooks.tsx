import axios from "api/axios-eli";
import { ModelData } from "pages/configurator/components/LoFiViewer/Simulation/ModelViewer/ModelData";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useScenarioStore } from "stores/scenarioStore";
import { useSimulationStore } from "stores/simulationStore";
import { AnalysisType } from "./AnalysisChoice";
import { CompletionState } from "./AnalysisStatus";

const pollStatusURL = (scenarioId: string, configurationId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/elisim/v1/firestore/${scenarioId}/${configurationId}`;

const startWindAnalysisURL = (scenarioId: string, configurationId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/windcomfort/v1/request/${scenarioId}/${configurationId}`;

const getWindAnalysisResultsURL = (scenarioId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/windcomfort/v1/results/${scenarioId}`;

const getSolarAnalysisResultsURL = (scenarioId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/solar/v1/${scenarioId}`;

const parseSolverStatus = (x: string): CompletionState => {
  if (x.indexOf("DRAFT") !== -1) {
    return "draft";
  } else if (x.indexOf("PENDING") !== -1) {
    return "pending";
  }
  return "solved";
};

const parseSimData = (x: string | object): ModelData => {
  if (typeof x === "string") {
    return JSON.parse(x.replaceAll("NaN", "null"));
  }
  return x as ModelData;
};

type PollStatus = {
  wind: CompletionState;
  solar: CompletionState;
  isMassingAvailable: boolean;
};

export type PollAPI = {
  status: PollStatus | null;
  reset: () => void;
  setPollStatus: (status: PollStatus) => void;
};

/**
 * Regularly polls the sim APIs for the solver status of the current configuration.
 * Returns the status for each solver.
 * Current implementation of API will automatically start the solver analysis job
 * after initial poll.
 */
export const usePoll = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [scenarioStore] = useScenarioStore();
  const configurationId = buildingService.configuration?.id;
  const scenarioId = scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : undefined;

  const [pollStatus, setPollStatus] = useState<PollStatus | "Error" | "None">("None");

  // Sets current 'pollStatus' to None, such that a poll request will be immediately fired.
  const reset = useCallback(() => {
    setPollStatus("None");
  }, []);

  const api = useMemo<PollAPI>(() => {
    if (pollStatus === "Error" || pollStatus === "None") {
      return { reset, status: null, setPollStatus };
    }
    return { status: pollStatus, reset, setPollStatus };
  }, [reset, pollStatus, setPollStatus]);

  useEffect(() => {
    if (!configurationId || !scenarioId) {
      return;
    }

    // set to true when useEffect unmounts. Cannot cancel the poll and we dont want
    // the poll function to setState if its running when it unmounts.
    let isCancelled = false;

    const doPoll = async () => {
      try {
        if (isCancelled) {
          return;
        }

        const response = await axios.get(pollStatusURL(scenarioId, configurationId));
        const data = await response.data;

        !isCancelled &&
          setPollStatus({
            wind: parseSolverStatus(data.wind_Comfort),
            solar: parseSolverStatus(data.daylight),
            isMassingAvailable: data.massing_Available
          });
      } catch {
        !isCancelled && setPollStatus("Error");
      }
    };

    // Each time the poll runs 'setPollStatus' will be called and this hook will remount.
    // The time to wait to the next poll depends on the previous status. If we haven't polled
    // yet then do it immediately. Otherwise poll once every minute. If there was an error
    // then poll in 5 seconds, in case it was a temporary fault in the network.
    // Also want to poll more frequently when massing is being generated, as starting wind
    // simulation is blocked until its ready.
    if (pollStatus === "None") {
      doPoll();
    } else if (pollStatus === "Error" || !pollStatus.isMassingAvailable) {
      setTimeout(doPoll, 5000);
    } else {
      setTimeout(doPoll, 60000);
    }

    return () => {
      isCancelled = true;
    };
  }, [scenarioId, configurationId, pollStatus]);

  return api;
};

/**
 * Returns a function handling the selection of a sim analysis in the modal.
 * The action to be taken depends on the status of the solver, therefore the
 * hook has a dependency on the poll status.
 * If a solver has not started yet for the current configuration then selecting
 * it will start it.
 * If a solver has completed and its results are available then selecting it
 * will fetch the results and show them.
 */
export const useSelectAnalysis = (pollApi: PollAPI) => {
  const [buildingService] = useV2BuildingServiceStore();
  const [scenarioStore] = useScenarioStore();
  const [, simulationActions] = useSimulationStore();

  const configurationId = buildingService.configuration?.id;
  const scenarioId = scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : undefined;

  return useCallback(
    async (analysis: AnalysisType) => {
      if (pollApi.status === null || !configurationId || !scenarioId) {
        return;
      }

      if (analysis === "wind") {
        if (pollApi.status.wind === "draft") {
          pollApi.setPollStatus({ ...pollApi.status, wind: "pending" });
          await axios.post(startWindAnalysisURL(scenarioId, configurationId));
          pollApi.reset();
        } else if (pollApi.status.wind === "solved") {
          simulationActions.setSelectedSimulationAnalysisType("Wind");
          try {
            const resp = await axios.get(getWindAnalysisResultsURL(scenarioId));
            const data = await resp.data;
            simulationActions.setSimulationAnalysisData(parseSimData(data));
          } catch {
            simulationActions.setSimulationAnalysisDataLoadFailed();
          }
        }
      } else if (analysis === "solar") {
        if (pollApi.status.solar === "solved") {
          simulationActions.setSelectedSimulationAnalysisType("Solar");
          try {
            const resp = await axios.get(getSolarAnalysisResultsURL(scenarioId));
            const data = await resp.data;
            simulationActions.setSimulationAnalysisData(parseSimData(data));
          } catch {
            simulationActions.setSimulationAnalysisDataLoadFailed();
          }
        }
      }
    },
    [pollApi, configurationId, scenarioId, simulationActions]
  );
};
