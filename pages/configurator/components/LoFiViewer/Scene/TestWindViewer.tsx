import React, { useEffect, useRef, useState } from "react";
import { useControls } from "leva";
import { useSimulationStore } from "stores/simulationStore";
import { Object3D } from "three";
import { Colour, colourSteps } from "../Simulation/ModelViewer/ColourFunction";
import { ModelViewer } from "../Simulation/ModelViewer/ModelViewer";

const hexToColour = (hex: string): Colour => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    return [r, g, b];
  }
  return [0, 0, 0];
};

const useLawsonColours = (selection: string) => {
  const [sitting, setSitting] = useState<string>("#B4D9F4");
  const [standing, setStanding] = useState<string>("#6BB7EE");
  const [strolling, setStrolling] = useState<string>("#4489DA");
  const [businessWalking, setBusinessWalking] = useState<string>("#315CCB");
  const [uncomfortable, setUncomfortable] = useState<string>("#F1A58D");
  const [unsafeFrail, setUnsafeFrail] = useState<string>("#ED7F86");
  const [unsafeAll, setUnsafeAll] = useState<string>("#D05D72");
  const [empty, setEmpty] = useState<string>("#9FA4BE");

  useControls({
    sitting: { value: sitting, onChange: setSitting },
    standing: { value: standing, onChange: setStanding },
    strolling: { value: strolling, onChange: setStrolling },
    businessWalking: { value: businessWalking, onChange: setBusinessWalking },
    uncomfortable: { value: uncomfortable, onChange: setUncomfortable },
    unsafeFrail: { value: unsafeFrail, onChange: setUnsafeFrail },
    unsafeAll: { value: unsafeAll, onChange: setUnsafeAll },
    empty: { value: empty, onChange: setEmpty }
  });

  const windCats = {
    "Lawson-2001-S20": unsafeAll,
    "Lawson-2001-S15": unsafeFrail,
    "Lawson-2001-E": uncomfortable,
    "Lawson-2001-D": businessWalking,
    "Lawson-2001-C": strolling,
    "Lawson-2001-B": standing,
    "Lawson-2001-A": sitting,
    "Lawson-2001-values": "Show All"
  };

  let colours;

  if (selection === "Lawson-2001-values") {
    colours = colourSteps(
      [
        { below: 0, colour: hexToColour(sitting) },
        { below: 1, colour: hexToColour(standing) },
        { below: 2, colour: hexToColour(strolling) },
        { below: 3, colour: hexToColour(businessWalking) },
        { below: 4, colour: hexToColour(uncomfortable) },
        { below: 5, colour: hexToColour(unsafeFrail) },
        { below: 6, colour: hexToColour(unsafeAll) }
      ],
      [0, 0, 0]
    );
  } else {
    colours = colourSteps(
      [
        { below: 0, colour: hexToColour(empty) },
        { below: 1, colour: hexToColour(windCats[selection]) }
      ],
      [0, 0, 0]
    );
  }
  return colours;
};

export const TestWindViewer = () => {
  const model = useRef<Object3D>(null);
  const [simulationState] = useSimulationStore();
  const colours = useLawsonColours(simulationState.selectedWindCategory);

  const data = simulationState.selectedSimulationAnalysis?.data;

  useEffect(() => {
    if (!model.current) {
      return;
    }
    const feetToMetres = 3.28;
    model.current.scale.set(feetToMetres, feetToMetres, feetToMetres);
  }, [data]);

  return data ? (
    <ModelViewer
      data={data}
      resultId="Lawson-2001"
      valueId={simulationState.selectedWindCategory}
      colourFunction={colours}
      ref={model}
    />
  ) : null;
};
