import { forwardRef, useEffect, useState } from "react";
import { BufferGeometry, Float32BufferAttribute, LineSegments, Mesh, Object3D } from "three";
import { materialLibrary } from "utils/materialLibrary";
import { ColourFunction } from "./ColourFunction";
import { AnalysisMesh, ModelData, findResults } from "./ModelData";

type ModelViewerProps = {
  data: ModelData;
  resultId: string;
  valueId: string;
  colourFunction: ColourFunction;
};

/**
 * Generates ThreeJS meshes visualizing the results of a simulation model. The model
 * can have multiple measurements, only one is displayed at a time. This is specified with
 * the 'resultId' and 'valueId' parameters.
 *
 * Currently supported cell types are 'LINE', 'QUAD4' and 'TRI3'.
 *
 * A 'ColourFunction' maps a value from the data to a displayed colour. They are displayed
 * as vertex colours on the threejs meshes.
 */
export const ModelViewer = forwardRef<Object3D, ModelViewerProps>((props, ref) => (
  <group ref={ref}>
    {props.data.analysisMeshes.map((am, i) => (
      <AnalysisMeshRenderer
        key={i}
        data={am}
        resultId={props.resultId}
        valueId={props.valueId}
        colourFunction={props.colourFunction}
      />
    ))}
  </group>
));

type AnalysisMeshProps = {
  data: AnalysisMesh;
  resultId: string;
  valueId: string;
  colourFunction: ColourFunction;
};

const AnalysisMeshRenderer = ({ data, resultId, valueId, colourFunction }: AnalysisMeshProps) => {
  return (
    <group name={data.name}>
      <AnalysisLinesRenderer data={data} resultId={resultId} valueId={valueId} colourFunction={colourFunction} />
      <AnalysisQuadsRenderer data={data} resultId={resultId} valueId={valueId} colourFunction={colourFunction} />
      <AnalysisTri3Renderer data={data} resultId={resultId} valueId={valueId} colourFunction={colourFunction} />
    </group>
  );
};

const AnalysisLinesRenderer = ({ data, resultId, valueId, colourFunction }: AnalysisMeshProps) => {
  const [geometry] = useState(() => new BufferGeometry());

  const [lineObj] = useState(
    () => new LineSegments(geometry, materialLibrary.lineBasicMaterial_SimulationAnalysisLine)
  );

  useEffect(() => {
    const positions = data.cells
      .filter((cell) => cell.type === "LINE")
      .flatMap((cell) => cell.connectivity.map((i) => data.points[i].coord))
      .flat();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  }, [geometry, data]);

  useEffect(() => {
    const results = findResults(data, resultId, valueId);
    const colours = data.cells
      .filter((cell) => cell.type === "LINE")
      .flatMap((cell) => cell.connectivity.map((i) => colourFunction(results.values[i], results.min, results.max)))
      .flat();

    geometry.setAttribute("color", new Float32BufferAttribute(colours, 3));
  }, [geometry, data, colourFunction, resultId, valueId]);

  return <primitive object={lineObj} />;
};

const splitQuads = <T extends unknown>(vals: T[]): T[] => {
  const out = [] as T[];
  const nQuads = vals.length / 4;
  for (let quad = 0; quad < nQuads; quad++) {
    const i = quad * 4;
    out.push(vals[i + 2], vals[i + 1], vals[i + 0], vals[i + 3], vals[i + 2], vals[i + 0]);
  }
  return out;
};

const AnalysisQuadsRenderer = ({ data, resultId, valueId, colourFunction }: AnalysisMeshProps) => {
  const [geometry] = useState(() => new BufferGeometry());
  const [quadsObj] = useState(() => new Mesh(geometry, materialLibrary.meshBasicMaterial_SimulationAnalysisFace));

  useEffect(() => {
    const positions = data.cells
      .filter((cell) => cell.type === "QUAD4")
      .flatMap((cell) => splitQuads(cell.connectivity.map((i) => data.points[i].coord)))
      .flat();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
  }, [geometry, data]);

  useEffect(() => {
    const results = findResults(data, resultId, valueId);
    const colours = data.cells
      .filter((cell) => cell.type === "QUAD4")
      .flatMap((cell) =>
        splitQuads(cell.connectivity.map((i) => colourFunction(results.values[i], results.min, results.max)))
      )
      .flat();
    geometry.setAttribute("color", new Float32BufferAttribute(colours, 3));
  }, [geometry, data, colourFunction, resultId, valueId]);

  return <primitive object={quadsObj} />;
};

const AnalysisTri3Renderer = ({ data, resultId, valueId, colourFunction }: AnalysisMeshProps) => {
  const [geometry] = useState(() => new BufferGeometry());
  const [tri3Obj] = useState(() => new Mesh(geometry, materialLibrary.meshBasicMaterial_SimulationAnalysisFace));

  useEffect(() => {
    const positions = data.cells
      .filter((cell) => cell.type === "TRI3")
      .flatMap((cell) => cell.connectivity.map((i) => data.points[i].coord))
      .flat();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
  }, [geometry, data]);

  useEffect(() => {
    const results = findResults(data, resultId, valueId);
    const colours = data.cells
      .filter((cell) => cell.type === "TRI3")
      .flatMap((cell) => cell.connectivity.map((i) => colourFunction(results.values[i], results.min, results.max)))
      .flat();
    geometry.setAttribute("color", new Float32BufferAttribute(colours, 3));
  }, [geometry, data, colourFunction, resultId, valueId]);

  return <primitive object={tri3Obj} />;
};
