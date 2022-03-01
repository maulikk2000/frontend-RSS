import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";
import classes from "./FinancialFrame.module.scss";

type FinancialFrameProps = {
  sensitivityId: string;
};

export const FinancialFrame: React.FC<FinancialFrameProps> = ({ sensitivityId }) => {
  const [loading, setLoading] = useState(true);
  const [streamlitUrlSrc, setStreamlitUrlSrc] = useState<string>("");

  useEffect(() => {
    if (sensitivityId) {
      setStreamlitUrlSrc(
        process.env.REACT_APP_STREAMLIT_URL + "?sensitivityId=" + sensitivityId + "&template=lca-discon" //TODO
      );
    }
  }, [sensitivityId]);

  const handleIframeLoaded = () => {
    setLoading(false);
  };

  return (
    <div className={classes.ScenarioFinancials}>
      {loading ? (
        <div className={classes.loading}>
          <LoadingSpinner />
        </div>
      ) : null}
      <iframe
        title="streamlit-ew-financial"
        name="streamlit-ew-financial"
        src={streamlitUrlSrc}
        width="100%"
        height="100%"
        referrerPolicy="no-referrer"
        seamless
        scrolling="false"
        frameBorder={0}
        onLoad={handleIframeLoaded}
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  );
};
