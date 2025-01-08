import React from "react";
import { Box, FormControlLabel, Checkbox, Stack } from "@mui/material";
import BossRoomMappings from "../../../../config/bossRoomMappings";

const AbilityControls = ({
  bossName,
  hoveredAbility,
  setHoveredAbility,
  abilitySetVisibility,
  setAbilitySetVisibility,
  handleToggleAll,
  handleSetToggle,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <Stack
      direction={{ xs: "row", sm: "column" }}
      spacing={2}
      sx={{
        position: "absolute",
        top: { xs: "auto", sm: 0 },
        bottom: { xs: 0, sm: "auto" },
        right: 0,
        zIndex: 10,
        padding: 1,
        maxWidth: { xs: "100%", sm: "auto" },
        overflowX: { xs: "auto", sm: "visible" },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={1.5}
        className="ability-toggle-container"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {Object.entries(BossRoomMappings.getAbilities(bossName))
          .filter(([key]) => !isNaN(key))
          .map(([abilityId, abilityData]) => (
            <Box
              key={abilityId}
              display="flex"
              flexDirection="column"
              alignItems="center"
              className="icon-container"
              sx={{
                position: "relative",
                transition: "transform 0.15s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onMouseEnter={() => handleMouseEnter(Number(abilityId))}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={abilityData.icon}
                alt={abilityData.name}
                className="ability-icon"
                aria-label={`Toggle ${abilityData.name} ability visibility`}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleToggleAll(abilityId, setAbilitySetVisibility)
                }
                style={{
                  width: "40px",
                  height: "40px",
                  position: "relative",
                  zIndex: 2,
                  border: `2px solid ${
                    Object.values(
                      abilitySetVisibility[abilityId]?.sets || {}
                    ).some((state) => state)
                      ? "#4CAF50"
                      : "#666"
                  }`,
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  filter: Object.values(
                    abilitySetVisibility[abilityId]?.sets || {}
                  ).some((state) => state)
                    ? "none"
                    : "grayscale(100%)",
                  cursor: "pointer",
                }}
              />

              {hoveredAbility === Number(abilityId) && (
                <Box
                  display="flex"
                  flexDirection="row-reverse"
                  alignItems="center"
                  className="expanded-controls"
                  gap={0.5}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "60px",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    zIndex: 1,
                  }}
                  onMouseEnter={() => setHoveredAbility(Number(abilityId))}
                  onMouseLeave={handleMouseLeave}
                >
                  {Object.keys(abilitySetVisibility[abilityId]?.sets || {}).map(
                    (setNumber) => (
                      <FormControlLabel
                        key={setNumber}
                        control={
                          <Checkbox
                            checked={
                              abilitySetVisibility[abilityId]?.sets[
                                setNumber
                              ] || false
                            }
                            onChange={() =>
                              handleSetToggle(
                                abilityId,
                                setNumber,
                                setAbilitySetVisibility
                              )
                            }
                            size="small"
                            sx={{
                              color: "#999",
                              "&.Mui-checked": {
                                color: "#4CAF50",
                              },
                            }}
                          />
                        }
                        labelPlacement="bottom"
                        label={`${setNumber}`}
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "12px",
                            color: "#fff",
                            fontWeight: 500,
                          },
                          m: 0,
                        }}
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
          ))}
      </Box>
    </Stack>
  );
};

export default AbilityControls;
