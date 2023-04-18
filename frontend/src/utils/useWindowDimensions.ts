import { useState, useEffect } from "react";

interface Dimensions {
  width: number;
  height: number;
}

/**
 * Returns the dimensions of the window
 *
 * @returns {Dimensions}
 */
function getWindowDimensions(): Dimensions {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

/**
 * Subscribes to the resize event listener and returns window size
 *
 * @returns {Dimensions}
 */
export default function useWindowDimensions(): Dimensions {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
