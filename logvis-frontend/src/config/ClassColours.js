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

const ClassToIcon = (playerClass) => {
  const classIcons = {
    Warrior:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg",
    Paladin:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_paladin.jpg",
    Hunter:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg",
    Rogue: "https://wow.zamimg.com/images/wow/icons/large/classicon_rogue.jpg",
    Priest:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_priest.jpg",
    DeathKnight:
      "https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_classicon.jpg",
    Shaman:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_shaman.jpg",
    Mage: "https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg",
    Warlock:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_warlock.jpg",
    Monk: "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
    Druid: "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
    DemonHunter:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg",
    Evoker:
      "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg",
  };
  return classIcons[playerClass] || "";
};

module.exports = { ClassToColour, ClassToIcon };
