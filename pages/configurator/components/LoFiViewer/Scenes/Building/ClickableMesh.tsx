import { MeshBasicMaterial, MeshPhongMaterial, Object3D } from "three";

type Props = {
  mesh: Object3D;
  receiveShadows: boolean;
  castShadows: boolean;
  isHidden: boolean;
  meshRef: ((element: any) => void) | undefined;
  index: number;
  handleClick: (e: any, mesh: Object3D, index?: number) => void;
  handleMouse: (e: any, mesh: Object3D, index: number, hoverOut?: boolean) => void;
  getMaterial: (mesh: Object3D) => MeshPhongMaterial | MeshBasicMaterial;
  renderOrder: number;
};

export const ClickableMesh = ({
  mesh,
  receiveShadows,
  castShadows,
  isHidden,
  meshRef,
  index,
  handleClick,
  handleMouse,
  getMaterial,
  renderOrder
}: Props) => {
  return (
    <mesh
      geometry={mesh["geometry"]}
      material={getMaterial(mesh)}
      visible={isHidden}
      receiveShadow={receiveShadows}
      castShadow={castShadows}
      onDoubleClick={(e) => handleClick(e, mesh, index)}
      renderOrder={renderOrder}
      ref={meshRef}
      onPointerOver={(e) => handleMouse(e, mesh, index)}
      onPointerOut={(e) => handleMouse(e, mesh, index, true)}
    />
  );
};
