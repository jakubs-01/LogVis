import { useCallback } from "react";
import * as d3 from "d3";

export const useZoomControls = (svgRef, zoomRef) => {
  const handleZoomIn = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 1.2); // Zoom in by 20%
  }, [svgRef, zoomRef]);

  const handleZoomOut = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.scaleBy, 0.8); // Zoom out by 20%
  }, [svgRef, zoomRef]);

  const handleResetZoom = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(zoomRef.current.transform, d3.zoomIdentity); // Reset zoom
  }, [svgRef, zoomRef]);

  return { handleZoomIn, handleZoomOut, handleResetZoom };
};

export default useZoomControls;
