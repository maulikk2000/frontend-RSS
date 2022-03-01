import { ShaderMaterial, UniformsUtils, BackSide, Mesh, SphereBufferGeometry } from "three";
import shader from "./shader";

export default class Sky extends Mesh {
  public geometry: SphereBufferGeometry = new SphereBufferGeometry(1, 32, 32);
  public material: ShaderMaterial = new ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: UniformsUtils.clone(shader.uniforms),
    side: BackSide,
    depthWrite: false
  });

  constructor() {
    super();

    this.castShadow = true;
  }
}
