import React from "react";
import { extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useFrame } from "react-three-fiber";
import { MouseControls } from "pages/configurator/data/mouseControls";

extend({ OrbitControls });

export const OrbitalControl = (props) => {
  useFrame(() => {
    props.orbit.current && props.orbit.current.update();
  });

  return (
    <orbitControls
      ref={props.orbit}
      args={[props.camera, props.gl.domElement]}
      enableDamping
      dampingFactor={0.8}
      rotateSpeed={0.8}
      mouseButtons={MouseControls}
      maxPolarAngle={props.is2D ? 0 : Math.PI}
      minPolarAngle={props.is2D ? 0 : -Math.PI}
      zoomSpeed={2}
      maxDistance={3000}
      screenSpacePanning={false}
    />
  );
};
