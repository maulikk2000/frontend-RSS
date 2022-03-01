import { HemisphereLight, DirectionalLight, DirectionalLightHelper, SpotLight } from "three";

export const hemisphereLight = () => {
  const hemisphereLight = new HemisphereLight(0xffffff, 0.4);
  hemisphereLight.color.setHSL(1, 1, 1);
  hemisphereLight.groundColor.setHSL(0, 0.8, 0.98);
  hemisphereLight.position.set(0, 0, 0);

  return hemisphereLight;
};

export const directionalLight = () => {
  let directionalLight = new DirectionalLight(0xffffff, 0.4);
  directionalLight.color.setHSL(1, 1, 1);
  directionalLight.position.set(-10000, 15000, 30000);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.radius = 2;
  directionalLight.shadow.camera.far = 50000;
  directionalLight.shadow.camera.near = 80;
  directionalLight.shadow.camera.left = -25000;
  directionalLight.shadow.camera.right = 25000;
  directionalLight.shadow.camera.top = 25000;
  directionalLight.shadow.camera.bottom = -25000;

  return directionalLight;
};

export const directionalLightHelper = () => {
  var d = 50;

  const dirLight = directionalLight();

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  const dirLightHelper = new DirectionalLightHelper(dirLight, 10);

  return dirLightHelper;
};

export const spotLight = () => {
  const spotLight = new SpotLight(0xaaaaaa);
  spotLight.position.set(2, 3, 3);
  spotLight.castShadow = true;
  spotLight.shadowBias = 0.0001;
  spotLight.shadowMapWidth = 2048; // Shadow Quality
  spotLight.shadowMapHeight = 2048; // Shadow Quality
};
