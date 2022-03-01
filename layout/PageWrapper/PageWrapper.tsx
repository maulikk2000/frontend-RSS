import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "pages/error/components/ErrorFallback/ErrorFallback";
import { useScenarioStore } from "stores/scenarioStore";
import { useProjectStore } from "stores/projectStore";
import { useMessageBar } from "hooks/useSnackbarMessage";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import classes from "./PageWrapper.module.scss";
import { useIntercom } from "react-use-intercom";
import { getLoggedInUserDetails } from "../../utils/intercomHelper";
import { useWorkspaceStore } from "stores/workspaceStore";

const PageWrapper = (props: { children?: React.ReactNode }) => {
  const { update } = useIntercom();
  const [workspaceStore, workspaceActions] = useWorkspaceStore();
  const [scenarioStoreState, scenarioStoreActions] = useScenarioStore();
  const [projectStoreState, projectStoreActions] = useProjectStore();
  const [buildingServiceStoreState, buildingServiceStoreActions] = useV2BuildingServiceStore();
  const showMessageBar = useMessageBar();

  useEffect(() => {
    update(getLoggedInUserDetails());
  }, [update]);

  useEffect(() => {
    showMessageBar(workspaceStore.message);
    workspaceActions.setMessageState();
  }, [workspaceActions, workspaceStore.message, showMessageBar]);

  useEffect(() => {
    showMessageBar(scenarioStoreState.message);
    scenarioStoreActions.setMessageState();
  }, [scenarioStoreActions, scenarioStoreState.message, showMessageBar]);

  useEffect(() => {
    if (projectStoreState.message) {
      showMessageBar(projectStoreState.message);
      projectStoreActions.setMessageState();
    }
  }, [projectStoreActions, projectStoreState.message, showMessageBar]);

  useEffect(() => {
    if (buildingServiceStoreState.message) {
      showMessageBar(buildingServiceStoreState.message);
      buildingServiceStoreActions.setMessageState();
    }
  }, [buildingServiceStoreActions, buildingServiceStoreState.message, showMessageBar]);

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div id="llcontent" className={classes.content}>
          {props.children}
        </div>
      </ErrorBoundary>
    </>
  );
};

export default PageWrapper;
