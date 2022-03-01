import { Leva } from "leva";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { context as reactThreeFiberContext } from "react-three-fiber";
import { InspectorsLayout } from "./Layout";

/**
 * A container of developer-facing 'inspector' components to assist in creating and
 * debugging the 3D scene. The inspectors are hidden by default and can be activated
 * with the 'ctrl-alt-i' combination on Windows or 'option-i' on MacOS.
 */
type Props = {
  container: HTMLElement;
};

export const Inspectors = ({ container }: Props) => {
  const isActive = useToggleInspector();
  useRenderInspector(container, isActive);

  return isActive ? null : <Leva hidden={true} />;
};

const useToggleInspector = () => {
  const [isActive, setIsActive] = useState(false);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      const shortcutPressed = evt.code === "KeyI" && ((evt.ctrlKey && evt.altKey) || evt.getModifierState("AltGraph"));
      if (shortcutPressed) {
        setIsActive(!isActive);
      }
    },
    [isActive]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return isActive;
};

/**
 * This may look a bit weird... When we render components under the <Canvas> element they exist
 * in a different context to ReactDOM.render at the root of the app. This makes sense because
 * react-three-fiber uses a different reconciler. ReactDOM reconciles to dom nodes, react-three-fiber
 * reconciles to threejs objects.
 *
 * In the inspector we want access to the react-three-fiber context, so it must be a child of
 * the <Canvas> element, but we also want it to render dom nodes. We must therefore render a new
 * ReactDOM hierarchy.
 * React contexts do not automatically propagate through so we must pipe them in manually.
 */
const useRenderInspector = (container: HTMLElement, isActive: boolean) => {
  const canvasContext = useContext(reactThreeFiberContext);
  useEffect(() => {
    if (!isActive) {
      return;
    }

    ReactDOM.render(
      <reactThreeFiberContext.Provider value={canvasContext}>
        <InspectorsLayout />
      </reactThreeFiberContext.Provider>,
      container
    );

    return () => {
      ReactDOM.unmountComponentAtNode(container);
    };
  }, [container, canvasContext, isActive]);
};
