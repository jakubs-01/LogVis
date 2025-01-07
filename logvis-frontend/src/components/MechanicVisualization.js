// src/components/MechanicVisualization.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import GameMap from "./GameMap/GameMap";
import LoadingOverlay from "./LoadingOverlay";

const MechanicVisualization = ({ reportCode, fight }) => {
  const [mechanicData, setMechanicData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMechanicData = async () => {
      setIsLoading(true);
      try {
        const [damageResponse, debuffResponse] = await Promise.all([
          axios.get(process.env.REACT_APP_DAMAGE_EVENTS_API_URL, {
            params: {
              reportCode,
              bossName: fight.name,
              fightIDs: fight.id,
            },
            withCredentials: true,
          }),
          axios.get(process.env.REACT_APP_DEBUFF_EVENTS_API_URL, {
            params: {
              reportCode,
              bossName: fight.name,
              fightIDs: fight.id,
            },
            withCredentials: true,
          }),
        ]);

        // Assuming both responses have a similar structure, e.g., `response.data` contains the data array
        const mergedData = [...damageResponse.data, ...debuffResponse.data];
        setMechanicData(mergedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (reportCode) {
      fetchMechanicData();
    }
  }, [reportCode, fight.id, fight.name]);

  // Visualization Logic
  return (
    <div>
      <div style={{ position: "relative", width: "1002px", height: "668px" }}>
        <GameMap
          coordinates={mechanicData}
          bossName={fight.name}
          fightStartTime={fight.startTime}
          fightID={fight.id}
          reportCode={reportCode}
        />
        {isLoading && (
          <LoadingOverlay
            message="Loading fight data..."
            width={1002}
            height={668}
          />
        )}
      </div>
    </div>
  );
};

export default MechanicVisualization;
