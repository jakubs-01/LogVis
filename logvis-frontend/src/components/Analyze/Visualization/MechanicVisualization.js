// src/components/MechanicVisualization.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import GameMap from "./GameMap/GameMap";
import LoadingOverlay from "../../Shared/LoadingOverlay";
import TimeLineVisualization from "./TimeLine/TimeLineVisualization";

const MechanicVisualization = ({ reportCode, fight }) => {
  const [mechanicData, setMechanicData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMechanicData = async () => {
      setIsLoading(true);
      // Clear existing data when starting a new fetch
      setMechanicData(null);
      console.log("MechanicVisualization UseEffect triggered");
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
        console.log(mergedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (reportCode) {
      fetchMechanicData();
    }
  }, [reportCode, fight]);

  // Visualization Logic
  return (
    <div>
      <div style={{ position: "relative", width: "1002px", height: "668px" }}>
        {!isLoading && mechanicData && mechanicData.length > 0 ? (
          <>
            <GameMap
              coordinates={mechanicData}
              bossName={fight.name}
              fightStartTime={fight.startTime}
              fightID={fight.id}
              reportCode={reportCode}
            />
            <TimeLineVisualization
              events={mechanicData}
              fightStartTime={fight.startTime}
            />
          </>
        ) : (
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
