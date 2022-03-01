import { useEffect, useRef } from "react";
import { Mesh, Shape, ShapeGeometry, SphereBufferGeometry, Vector2, Vector3 } from "three";
import { useFrame, useThree } from "react-three-fiber";
import { SiteNoteObject } from "types/siteNote";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  point: Vector3;
  siteNote: SiteNoteObject;
  vertexHovered: boolean;
  setVertexHovered: React.Dispatch<React.SetStateAction<boolean>>;
  deleteSiteNote: (siteNote: SiteNoteObject) => void;
};

const vertexGeometry = new SphereBufferGeometry(1, 32, 32);

const vertexBackgroundGeometry = new SphereBufferGeometry(0.75, 32, 32);

const collisionVertexGeometry = new SphereBufferGeometry(1, 32, 32);

const xGeometry = () => {
  const XWidth = 0.08;
  const XLength = 0.5;

  let XShape = new Shape([
    new Vector2(-XWidth, XLength),
    new Vector2(XWidth, XLength),
    new Vector2(XWidth, XWidth),
    new Vector2(XLength, XWidth),
    new Vector2(XLength, -XWidth),
    new Vector2(XWidth, -XWidth),
    new Vector2(XWidth, -XLength),
    new Vector2(-XWidth, -XLength),
    new Vector2(-XWidth, XWidth),
    new Vector2(-XWidth, -XWidth),
    new Vector2(-XLength, -XWidth),
    new Vector2(-XLength, XWidth),
    new Vector2(-XWidth, XWidth)
  ]);
  const pointerGeometry = new ShapeGeometry(XShape);
  pointerGeometry.rotateZ(0.8);
  return pointerGeometry;
};

export const SiteNoteVertex = ({ siteNote, point, vertexHovered, setVertexHovered, deleteSiteNote }: Props) => {
  const { camera, gl } = useThree();

  const vertexMaterialMeshRef = useRef<Mesh>();
  const vertexBackgroundMaterialMeshRef = useRef<Mesh>();
  const xMaterialMeshRef = useRef<Mesh>();

  //Added in a collision mesh that lies over the whole vertex to detect pointer on/off
  //Otherwise, theres too many pointer on/off calls each time the cursor moves because theres so many meshes in one spot.
  const collisionMeshRef = useRef<Mesh>();

  useEffect(() => {
    if (vertexHovered) {
      gl.domElement.style.cursor = "pointer";
      xMaterialMeshRef.current!.material = materialLibrary.meshBasicMaterial_SiteNoteXHovered;
    } else {
      gl.domElement.style.cursor = "crosshair";
      xMaterialMeshRef.current!.material = materialLibrary.meshBasicMaterial_SiteNoteX;
    }
  });

  useFrame(() => {
    //Would like to have all meshes use the same Ref for scaling because these refs all do the same thing, but components cant share the same ref
    if (
      vertexMaterialMeshRef.current &&
      vertexBackgroundMaterialMeshRef.current &&
      xMaterialMeshRef.current &&
      collisionMeshRef.current
    ) {
      vertexMaterialMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
      vertexBackgroundMaterialMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
      xMaterialMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
      collisionMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
    }
  });
  return (
    <>
      <mesh
        ref={vertexMaterialMeshRef}
        position={point}
        geometry={vertexGeometry}
        material={materialLibrary.meshBasicMaterial_SiteNoteVertex}
      ></mesh>
      <mesh
        ref={vertexBackgroundMaterialMeshRef}
        position={point}
        geometry={vertexBackgroundGeometry}
        material={materialLibrary.meshBasicMaterial_SiteNoteVertexBackground}
      ></mesh>
      <mesh
        ref={xMaterialMeshRef}
        position={point}
        geometry={xGeometry()}
        material={materialLibrary.meshBasicMaterial_SiteNoteX}
      ></mesh>
      <mesh
        ref={collisionMeshRef}
        position={new Vector3(point.x, point.y, point.z)}
        geometry={collisionVertexGeometry}
        material={materialLibrary.meshBasicMaterial_SiteNoteCollision}
        onClick={() => {
          setVertexHovered(false);
          deleteSiteNote(siteNote);
        }}
        onPointerOver={() => setVertexHovered(true)}
        onPointerOut={() => setVertexHovered(false)}
      ></mesh>
      ))
    </>
  );
};
