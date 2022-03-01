import GA4React from "ga-4-react";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";

const google_Analytics_Tracking_Id: string = process.env.REACT_APP_ENVISION_GA_TRACKING_ID!;

const userId = localStorageService.getLocalStorageItem(LocalStorgeKey.auth0_user_id);

export const callGoogleAnalyticsG4 = async () => {
  const ga4react = new GA4React(
    google_Analytics_Tracking_Id,
    {
      /* ga custom config, optional */
    },
    [
      /* additional code, optional */
    ],
    3600000 /* timeout, optional */
  );

  if (!GA4React.isInitialized()) {
    await ga4react.initialize();
  } else {
    ga4react.gtag("event", "pageview", {
      user_id: userId
    });
  }
};
