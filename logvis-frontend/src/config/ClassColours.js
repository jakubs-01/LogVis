const ClassToColour = (playerClass) => {
  const classColors = {
    Warrior: "#C79C6E",
    Paladin: "#F58CBA",
    Hunter: "#ABD473",
    Rogue: "#FFF569",
    Priest: "#FFFFFF",
    DeathKnight: "#C41F3B",
    Shaman: "#0070DE",
    Mage: "#69CCF0",
    Warlock: "#9482C9",
    Monk: "#00FF96",
    Druid: "#FF7D0A",
    DemonHunter: "#A330C9",
    Evoker: "#33937F",
  };
  return classColors[playerClass] || "#AAAAAA";
};

module.exports = { ClassToColour };
