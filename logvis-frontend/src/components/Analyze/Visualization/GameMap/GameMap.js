import React, { useEffect, useRef, useState } from "react";
import { ClassToColour } from "../../../../config/ClassColours";
import AbilityControls from "./AbilityControls";
import BossRoomMappings from "../../../../config/bossRoomMappings";
import ButtonControls from "./ButtonControls";
import * as d3 from "d3";
import { useTooltip } from "../../../../hooks/useTooltip";
import { useZoomControls } from "../../../../hooks/zoomControls";
import { AbilityToggle } from "../../../../hooks/abilityToggle";
import MapTooltip from "./Tooltips/MapTooltip";
import axios from "axios";
import ApiService from "../../../../service/ApiService";

const GameMap = ({
  coordinates,
  bossName,
  fightStartTime,
  fightID,
  reportCode,
}) => {
  const [mapImage, setMapImage] = React.useState("");
  const svgRef = useRef();
  const zoomRef = useRef(); // To store the D3 zoom instance
  const timeoutRef = useRef(null); // Ref to store the timeout ID
  const [abilitySetVisibility, setAbilitySetVisibility] = useState({});
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipPosition,
    isTooltipVisible,
  } = useTooltip(bossName);
  const { handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(
    svgRef,
    zoomRef
  );
  const { handleSetToggle, handleToggleAll } = AbilityToggle();

  useEffect(() => {
    const fetchAbilityVisibility = async () => {
      try {
        const response = await ApiService.getAbilityVisibility();
        setAbilitySetVisibility(response.data);
      } catch (error) {
        console.error("Error fetching ability visibility:", error);
      }
    };

    fetchAbilityVisibility();
  }, []);
  const [hoveredAbility, setHoveredAbility] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    // For Ansurek, check if we were previously viewing the alt map
    const currentMapId =
      mapImage === `${BossRoomMappings.getMapID_alt(bossName)}`
        ? BossRoomMappings.getMapID_alt(bossName)
        : BossRoomMappings.getMapID(bossName);
    setMapImage(`${currentMapId}`);
    const originalWidth = 1002;
    const originalHeight = 668;

    // Create a group to apply zoom and pan transformations
    const mapGroup = svg.append("g");

    // Append the map image
    mapGroup
      .append("image")
      .attr("xlink:href", `/${mapImage}.png`)
      .attr("width", originalWidth)
      .attr("height", originalHeight);

    // Group coordinates by ability and set number
    const groupedCoordinates = {};
    // Group coordinates by ability and set number
    if (Array.isArray(coordinates)) {
      coordinates.forEach((coord) => {
        const key = `${coord.abilityGameID}-${coord.setnumber}`;
        if (!groupedCoordinates[key]) {
          groupedCoordinates[key] = [];
        }
        groupedCoordinates[key].push([
          coord.x * originalWidth,
          (1 - coord.y) * originalHeight,
        ]);
      });

      // Create hulls for each group
      Object.entries(groupedCoordinates).forEach(([key, points]) => {
        const [abilityId, setNumber] = key.split("-");

        // Only create hull if there are enough points and the set is visible
        if (
          points.length >= 3 &&
          abilitySetVisibility[abilityId]?.sets[setNumber]
        ) {
          const hull = d3.polygonHull(points);
          if (hull) {
            mapGroup
              .append("path")
              .datum(hull)
              .attr("d", (d) => `M${d.join("L")}Z`)
              .attr(
                "fill",
                `rgba(${
                  (parseInt(setNumber.replace("set", "")) * 30 + 150) % 255
                }, ${
                  (parseInt(setNumber.replace("set", "")) * 40 + 180) % 255
                }, ${
                  (parseInt(setNumber.replace("set", "")) * 50 + 200) % 255
                }, 0.3)`
              )
              .attr("stroke", "none") // Added stroke to make it more visible
              .attr("stroke-width", "1")
              .style("z-index", 2);

            // Calculate centroid of the hull for text placement
            const centroid = d3.polygonCentroid(hull);

            // Add text label
            mapGroup
              .append("text")
              .attr("x", centroid[0])
              .attr("y", centroid[1])
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("fill", "black")
              .attr("font-size", "8px")

              .style("z-index", 3)
              .text(setNumber.replace("set", ""));
          }
        }
      });
    }

    // Append circles for coordinates
    const circles = mapGroup
      .selectAll("circle")
      .data(coordinates)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x * originalWidth)
      .attr("cy", (d) => (1 - d.y) * originalHeight)
      .attr("r", 5)
      .attr("opacity", (d) =>
        abilitySetVisibility[d.abilityGameID]?.sets[d.setnumber] ? 1 : 0
      )
      .attr("fill", (d) => ClassToColour(d.playerClass))
      .attr("stroke", "#000")
      .attr("stroke-width", "1")
      .attr("stroke-opacity", 0.8)

      .style("cursor", (d) =>
        abilitySetVisibility[d.abilityGameID]?.sets[d.setnumber]
          ? "pointer"
          : "default"
      )
      .on("click", (event, d) => {
        if (abilitySetVisibility[d.abilityGameID]?.sets[d.setnumber]) {
          event.stopPropagation();
          showTooltip(event, d, fightStartTime, fightID, reportCode);
        }
      });

    // Add a click listener to hide the tooltip when clicking on the SVG
    svg.on("click", hideTooltip);

    // D3 Zoom Behavior
    const zoom = d3
      .zoom()
      .translateExtent([
        [0, 0],
        [originalWidth, originalHeight],
      ]) // Restrict pan bounds
      .scaleExtent([1, 10]) // Min and max zoom levels
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform); // Apply zoom/pan transformations
        const zoomScale = event.transform.k; // Get the current zoom scale
        circles.attr("r", Math.min((5 / zoomScale) * 2, 5));
        circles.attr("stroke-width", (d) => 1 / Math.pow(zoomScale, 0.65));
      });

    // Attach zoom to the SVG
    svg.call(zoom);

    // Store the zoom instance in the ref
    zoomRef.current = zoom;

    // Initial zoom/pan settings
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(
          BossRoomMappings.getOffsets(bossName)[0],
          BossRoomMappings.getOffsets(bossName)[1]
        )
        .scale(BossRoomMappings.getZoomFactor(bossName)) // Example initial zoom
    );
    return () => {
      hideTooltip();
    };
  }, [
    mapImage,
    coordinates,
    abilitySetVisibility,
    bossName,
    fightID,
    fightStartTime,
    reportCode,
    showTooltip,
    hideTooltip,
  ]);

  const swapMapAnsurek = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return; // Guard against null svg

    // Get current map image source
    const currentImage = svg.select("image");
    const currentMapImage = currentImage.node()
      ? currentImage.attr("xlink:href")
      : null;

    // Determine which map ID to use
    let mapIdToUse;
    if (
      currentMapImage &&
      currentMapImage.includes(BossRoomMappings.getMapID(bossName))
    ) {
      mapIdToUse = BossRoomMappings.getMapID_alt(bossName);
    } else {
      mapIdToUse = BossRoomMappings.getMapID(bossName);
    }
    setMapImage(`${mapIdToUse}`);
    // Update existing image source instead of recreating
    currentImage.attr("xlink:href", `/${mapIdToUse}.png`);
  };

  const handleMouseEnter = (abilityId) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to trigger the hover effect after the desired delay

    setHoveredAbility(abilityId);
  };
  const handleMouseLeave = () => {
    // Set a timeout to clear the hover state after the grace period
    timeoutRef.current = setTimeout(() => {
      setHoveredAbility(null);
    }, 300); // Grace period before setting to null
  };

  return (
    <div style={{ position: "relative", width: "1002px", height: "668px" }}>
      {/* Buttons for Zoom Controls */}

      <AbilityControls
        bossName={bossName}
        hoveredAbility={hoveredAbility}
        setHoveredAbility={setHoveredAbility}
        abilitySetVisibility={abilitySetVisibility}
        setAbilitySetVisibility={setAbilitySetVisibility}
        handleToggleAll={handleToggleAll}
        handleSetToggle={handleSetToggle}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <ButtonControls
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
        swapMapAnsurek={swapMapAnsurek}
        isAnsurek={bossName === "Queen Ansurek"}
      />

      {/* SVG Map */}
      <svg
        ref={svgRef}
        width="1002"
        height="668"
        style={{ border: "1px solid black" }}
      ></svg>
      <MapTooltip
        data={tooltipData}
        position={tooltipPosition}
        isVisible={isTooltipVisible}
      />
    </div>
  );
};

export default GameMap;
