import { useCallback } from "react";

export const AbilityToggle = () => {
  const handleSetToggle = useCallback(
    (abilityID, setNumber, setAbilitySetVisibility) => {
      setAbilitySetVisibility((prev) => {
        const newState = { ...prev };
        newState[abilityID].sets[setNumber] =
          !newState[abilityID].sets[setNumber];
        newState[abilityID].all = Object.values(newState[abilityID].sets).every(
          (state) => state
        );
        return newState;
      });
    },
    []
  );

  // Handle toggling all sets for an ability
  const handleToggleAll = useCallback((abilityID, setAbilitySetVisibility) => {
    setAbilitySetVisibility((prev) => {
      const newState = { ...prev };
      const currentAllState = newState[abilityID].all;
      for (let set in newState[abilityID].sets) {
        newState[abilityID].sets[set] = !currentAllState;
      }
      newState[abilityID].all = !currentAllState;
      return newState;
    });
  }, []);
  return { handleSetToggle, handleToggleAll };
};

export default AbilityToggle;
