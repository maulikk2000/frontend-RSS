import React, { useEffect } from "react";
import { Mesh, ExtrudeBufferGeometry, Material } from "three";
import { coordinate } from "pages/configurator/data/types";
import {
  coordinateToCartesian,
  coordinateToVector3,
  createThreeJSObjectFromVectors
} from "pages/configurator/components/utils";

type Props = {
  objectRef: React.RefObject<Mesh | undefined>;
  coordinates: coordinate[];
  worldCoordinates: coordinate;
  height?: number;
  material: Material;
  receiveShadow?: boolean;
  onHover?: (event: any) => void;
  onHoverOut?: (event: any) => void;
  onClick?: (event: any) => void;
};

export const CoordinateObject = ({
  objectRef,
  coordinates,
  worldCoordinates,
  height = 0,
  material,
  receiveShadow = false,
  onHover,
  onHoverOut,
  onClick
}: Props) => {
  useEffect(() => {
    const cartesians = coordinates.map((coordinate) => {
      return coordinateToCartesian(coordinate, worldCoordinates, "ft");
    });

    const vectors = cartesians.map(coordinateToVector3);

    const envelope: ExtrudeBufferGeometry | null = createThreeJSObjectFromVectors(vectors, height);

    if (objectRef && objectRef.current && envelope) {
      objectRef.current.geometry = envelope;
    }
  }, [, coordinates, height, worldCoordinates]);

  return (
    <mesh
      ref={objectRef}
      receiveShadow={receiveShadow}
      castShadow={receiveShadow}
      onPointerOver={onHover}
      material={material}
      onPointerOut={onHoverOut}
      onDoubleClick={onClick}
    />
  );
};
