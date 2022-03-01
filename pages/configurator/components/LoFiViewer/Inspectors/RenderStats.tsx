import React, { useEffect, useRef } from "react";
import { isNil } from "lodash-es";
import { addAfterEffect, addEffect, useFrame, useThree } from "react-three-fiber";
import rStats from "rstatsjs/src/rStats";
import "./rStats.css";

export const RenderStats = () => {
  const rs = useRef<rStats>();
  const rStatsContainer = useRef<HTMLDivElement>(null);

  const three = useThree();

  useEffect(() => {
    if (rStatsContainer.current === null) {
      return;
    }

    rs.current = new rStats({
      css: [],
      values: {
        fps: { caption: "FPS", under: 59 },
        ms: { caption: "Frame (ms)", over: 16.66 },
        geometries: { caption: "Meshes" },
        textures: { caption: "Textures" },
        programs: { caption: "Shaders" },
        drawcalls: { caption: "Calls", over: 500 },
        triangles: { caption: "Tris (k)", over: 500 },
        lines: { caption: "Lines (k)", over: 500 }
      },
      groups: [
        { caption: "Framerate", values: ["fps", "ms"] },
        {
          caption: "Render",
          values: ["drawcalls", "triangles", "lines"]
        },
        {
          caption: "Memory",
          values: ["geometries", "programs", "textures"]
        }
      ]
    });

    const el = rs.current().element;
    const containerEl = rStatsContainer.current;
    containerEl.appendChild(el);

    const removeBeforeFrameHandler = addEffect(() => {
      rs.current("ms").start();
      return true;
    });

    const removeAfterFrameHandler = addAfterEffect(() => {
      rs.current("ms").end();
      return true;
    });

    return () => {
      containerEl.removeChild(el);
      removeBeforeFrameHandler();
      removeAfterFrameHandler();
    };
  }, [three]);

  useFrame(() => {
    if (isNil(rs.current)) {
      return;
    }
    rs.current("fps").frame();
    rs.current("geometries").set(three.gl.info.memory.geometries);
    rs.current("textures").set(three.gl.info.memory.textures);
    rs.current("programs").set(three.gl.info.programs?.length ?? 0);
    rs.current("drawCalls").set(three.gl.info.render.calls);
    rs.current("triangles").set(Math.round(three.gl.info.render.triangles / 1000));
    rs.current("lines").set(Math.round(three.gl.info.render.lines / 1000));
    rs.current().update();
  });

  return <div ref={rStatsContainer} />;
};
