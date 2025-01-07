import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { generateTooltipContent } from "../../../utils/tooltipHelpers";

const MapTooltip = ({ data, position, isVisible }) => {
  useEffect(() => {
    if (
      isVisible &&
      window.$WowheadPower &&
      window.$WowheadPower.refreshLinks
    ) {
      window.$WowheadPower.refreshLinks();
    }
  }, [isVisible, data]); // Re-run when visibility or data changes
  if (!isVisible || !data) return null;

  return ReactDOM.createPortal(
    <div
      className="tooltip"
      style={{
        position: "absolute",
        left: position.x + "px",
        top: position.y + "px",
        background: "linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8))",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        maxWidth: "300px",
        transform: "scale(1)",
        animation: "tooltipFadeIn 0.2s ease-out",
      }}
    >
      <style>
        {`
          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
      {generateTooltipContent(data)}
    </div>,
    document.body
  );
};

export default MapTooltip;
