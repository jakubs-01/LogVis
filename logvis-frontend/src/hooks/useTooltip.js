import { useCallback, useState } from "react";
import * as d3 from "d3";

export const useTooltip = (bossName) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const showTooltip = useCallback(
    (event, data, fightStartTime, fightID, reportCode) => {
      setTooltipData({
        ...data,
        fightStartTime,
        fightID,
        reportCode,
        bossName,
      });
      setTooltipPosition({ x: event.pageX + 10, y: event.pageY + 10 });
      setIsTooltipVisible(true);
    },
    [bossName]
  );

  const hideTooltip = useCallback(() => {
    const tooltip = d3.select("body").select(".tooltip");
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
      .style("pointer-events", "none");
    setIsTooltipVisible(false);
  }, []);

  return {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipPosition,
    isTooltipVisible,
  };
};

export default useTooltip;
