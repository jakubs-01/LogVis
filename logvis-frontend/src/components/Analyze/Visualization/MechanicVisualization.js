// src/components/MechanicVisualization.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import GameMap from "./GameMap/GameMap";
import LoadingOverlay from "../../Shared/LoadingOverlay";
import TimeLineVisualization from "./TimeLine/TimeLineVisualization";
import { Box, Grid } from "@mui/material";
import BossRoomMappings from "../../../config/bossRoomMappings";
import ApiService from "../../../service/ApiService";

const MechanicVisualization = ({ reportCode, fight }) => {
  const [mechanicData, setMechanicData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unSupportedBoss, setUnSupportedBoss] = useState(false);
  useEffect(() => {
    const fetchMechanicData = async () => {
      setIsLoading(true);
      // Clear existing data when starting a new fetch
      setMechanicData([]);
      try {
        const [damageResponse, debuffResponse] = await Promise.all([
          ApiService.getDamageEvents(reportCode, fight.name, fight.id),
          ApiService.getDebuffEvents(reportCode, fight.name, fight.id),
        ]);

        // Assuming both responses have a similar structure, e.g., `response.data` contains the data array
        const mergedData = [...damageResponse.data, ...debuffResponse.data];
        setMechanicData(mergedData);
        setIsLoading(false);
        setUnSupportedBoss(false);
      } catch (error) {
        if (error.response.status === 501) {
          setUnSupportedBoss(true);
        }
        setIsLoading(false);
        console.error(error);
      }
    };

    if (reportCode) {
      fetchMechanicData();
    }
  }, [reportCode, fight]);

  // Visualization Logic
  if (unSupportedBoss || !BossRoomMappings.doesBossExist(fight.name)) {
    return <div>Boss not supported</div>;
  }

  if (isLoading || !mechanicData || mechanicData.length === 0) {
    return (
      <Box>
        <Box sx={{ position: "fixed" }}>
          <LoadingOverlay
            message="Loading fight data..."
            width={1002}
            height={668}
          />
        </Box>
      </Box>
    );
  }
  if (!Array.isArray(mechanicData)) {
    console.error("mechanicData is not an array:", mechanicData);
    return null;
  }

  return (
    <Box>
      <Box sx={{ position: "fixed" }}>
        <Grid container spacing={0.5}>
          <Grid item xs={8}>
            <GameMap
              coordinates={mechanicData}
              bossName={fight.name}
              fightStartTime={fight.startTime}
              fightID={fight.id}
              reportCode={reportCode}
            />
          </Grid>
          <Grid item xs={4}>
            <TimeLineVisualization
              events={mechanicData}
              fightStartTime={fight.startTime}
              fightID={fight.id}
              reportCode={reportCode}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MechanicVisualization;
