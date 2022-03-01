import { useGA4React } from "ga-4-react";
import { callGoogleAnalyticsG4 } from "./googleAnalytics";

export const initializeAnalytics = async () => {
  callGoogleAnalyticsG4();
};

type AnalyticsEvent = {
  scenario_create: { workspace_name: string; project_id: string };
  scenario_view: {
    workspace_name: string;
    project_id: string;
    scenario_id: string;
  };
  project_create: {
    workspace_name: string;
    parcel_type: "custom" | "known";
  };
  project_view: {
    workspace_name: string;
    project_id: string;
    source: "map" | "list";
  };
  workspace_view: {
    workspace_name: string;
  };
  secondary_nav_click: {
    workspace_name: string;
    item_name: string;
  };
  button_click: {
    button_id: string;
  };
};

export const useAnalytics = () => {
  const googleAnalytics = useGA4React();

  const trackEvent = <K extends keyof AnalyticsEvent>(name: K, data: AnalyticsEvent[K]): void => {
    if (googleAnalytics) {
      googleAnalytics.gtag("event", name, data);
    }
  };

  return { trackEvent };
};
