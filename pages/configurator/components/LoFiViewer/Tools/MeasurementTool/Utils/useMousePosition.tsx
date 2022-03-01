import { useEffect, useRef } from "react";

//Exporting cursor location into a hook for reuse.
export const useMousePosition = () => {
  const eventRef = useRef<MouseEvent>();

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => (eventRef.current = e);
    document.addEventListener("pointermove", setFromEvent);

    return () => {
      document.removeEventListener("pointermove", setFromEvent);
    };
  }, []);

  return eventRef;
};
