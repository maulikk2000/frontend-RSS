import { GUI } from "dat.gui";

/**
 * This file is not currently being used but
 * it would be nice to keep this file as it helps
 * debugging any issues with the sky shader
 */

export interface IEffectController {
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  luminance: number;
  inclination: number;
  azimuth: number;
  sun: boolean;
}

let gui: GUI | null;

export const addGUIControls = (effectController: any, handleChange: () => void) => {
  gui = new GUI();

  gui.domElement.id = "gui";

  gui.add(effectController, "turbidity", 1.0, 20.0, 0.1).onChange(handleChange);
  gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(handleChange);
  gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(handleChange);
  gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(handleChange);
  gui.add(effectController, "luminance", 0.0, 2).onChange(handleChange);
  gui.add(effectController, "inclination", -0.05, 1.05, 0.0001).onChange(handleChange);
  gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(handleChange);
  gui.add(effectController, "sun").onChange(handleChange);

  handleChange();
};

export const removeGUIControls = () => {
  gui = null;
  return gui;
};

export default addGUIControls;
