import axios from "api/axios-eli";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelectedProject } from "stores/projectStore";
import { useScenarioStore } from "stores/scenarioStore";
import { exportConfiguration, exportContext } from "./stlExporters";

const uploadBuildingURL = (scenarioId: string, configurationId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/elisim/v1/massing/upload/building/${scenarioId}/${configurationId}`;

const uploadContextURL = (scenarioId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/elisim/v1/massing/upload/context/${scenarioId}`;

const checkBuildingExistsURL = (scenarioId: string, configurationId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/elisim/v1/firestore/${scenarioId}/${configurationId}`;

const checkContextExistsURL = (scenarioId: string) =>
  `${process.env.REACT_APP_BASE_API}/api/elisim/v1/firestore/${scenarioId}`;

/**
 * Queries the API if an STL has been generated yet for the given scenarioId,configurationId.
 * returns true if one is required (has not been uploaded yet) and false otherwise.
 */
const useQueryBuildingRequired = (scenarioId?: string, configurationId?: string) => {
  const [isRequired, setIsRequired] = useState(false);
  const [retries, setRetries] = useState(0);

  // useLayoutEffect so isRequired is synchronously set to false. This is to
  // avoid potential race conditions where 'isRequired' had been previously
  // true and then configurationId changed.
  useLayoutEffect(() => {
    setIsRequired(false);
    if (!scenarioId || !configurationId) {
      return;
    }
    let isSubscribed = true;

    (async () => {
      try {
        const response = await axios.get(checkBuildingExistsURL(scenarioId, configurationId));
        const data = await response.data;
        if (isSubscribed && (data.configuration_Id !== configurationId || !data.massing_Available)) {
          setIsRequired(true);
        }
      } catch (e) {
        console.error(e);
        setTimeout(() => {
          isSubscribed && setRetries(retries + 1);
        }, 1000);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [scenarioId, configurationId, retries]);

  return isRequired;
};

/**
 * Queries the API if an STL has been generated yet for the given scenarioId.
 * returns true if one is required (has not been uploaded yet) and false otherwise.
 */
const useQueryContextRequired = (scenarioId?: string) => {
  const [isRequired, setIsRequired] = useState(false);
  const [retries, setRetries] = useState(0);

  // useLayoutEffect so isRequired is synchronously set to false. This is to
  // avoid potential race conditions where 'isRequired' had been previously
  // true and then configurationId changed.
  useLayoutEffect(() => {
    setIsRequired(false);
    if (!scenarioId) {
      return;
    }
    let isSubscribed = true;

    (async () => {
      try {
        const response = await axios.get(checkContextExistsURL(scenarioId));
        const data = await response.data;
        if (isSubscribed && !data) {
          setIsRequired(true);
        }
      } catch (e) {
        console.error(e);
        setTimeout(() => {
          isSubscribed && setRetries(retries + 1);
        }, 1000);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [scenarioId, retries]);

  return isRequired;
};

/**
 * For a new configuration ID this hook will convert the massings into STL format and upload
 * it to the simulations API. Checks first if an STL exists already. Will retry periodically
 * if there are connection errors.
 *
 * Will only upload the massings. Surrounding buildings (context) is uploaded seperately.
 */
export const useUploadBuildingSTL = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [scenarioStore] = useScenarioStore();

  const configuration = buildingService.configuration;
  const scenarioId = scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : undefined;

  const isBuildingRequired = useQueryBuildingRequired(scenarioId, configuration?.id);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    if (!isBuildingRequired || !configuration || !configuration.id || !scenarioId) {
      return;
    }
    let isSubscribed = true;
    const stl = exportConfiguration(configuration);
    axios
      .post(uploadBuildingURL(scenarioId, configuration.id), stl, {
        headers: { "Content-Type": "text/plain" }
      })
      .catch((e) => {
        console.error(e);
        setTimeout(() => {
          isSubscribed && setRetries(retries + 1);
        }, 1000);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isBuildingRequired, configuration, scenarioId, retries]);
};

/**
 * For a newly created scenario this hook will convert the surrounding buildings to STL
 * format and upload it to the simulations API. Only uploads if an stl doesnt already
 * exist. Will retry periodically if there are connection errors.
 */
export const useUploadContextSTL = () => {
  const [scenarioStore] = useScenarioStore();
  const scenarioId = scenarioStore.selectedScenarioIds.length > 0 ? scenarioStore.selectedScenarioIds[0] : undefined;

  const [selectedProject] = useSelectedProject();
  const worldCoords = selectedProject?.siteWorldCoordinates;
  const zoneCoords = selectedProject?.coordinates;

  const isContextRequired = useQueryContextRequired(scenarioId);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    if (!isContextRequired || !scenarioId || !worldCoords || !zoneCoords) {
      return;
    }
    let isSubscribed = true;

    (async () => {
      try {
        const stl = await exportContext(worldCoords, zoneCoords);
        if (!isSubscribed) {
          return;
        }
        await axios.post(uploadContextURL(scenarioId), stl, {
          headers: { "Content-Type": "text/plain" }
        });
      } catch (e) {
        console.error(e);
        setTimeout(() => {
          isSubscribed && setRetries(retries + 1);
        }, 1000);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [isContextRequired, scenarioId, worldCoords, zoneCoords, retries]);
};
