import { Leva } from "leva";
import React from "react";
import { RenderStats } from "./RenderStats";

export const InspectorsLayout = () => (
  <>
    <Leva theme={{ sizes: { rootWidth: "325px" } }} />
    <RenderStats />
  </>
);
