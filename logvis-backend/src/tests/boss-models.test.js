const createBossInstance = require("../models/boss-factory");
const Ulgrax = require("../models/nerubar-palace/ulgrax");
const Bloodbound = require("../models/nerubar-palace/bloodbound");
const Sikran = require("../models/nerubar-palace/sikran");
const Rashanan = require("../models/nerubar-palace/rashanan");
const Broodtwister = require("../models/nerubar-palace/broodtwister");
const Kyveza = require("../models/nerubar-palace/kyveza");
const SilkenCourt = require("../models/nerubar-palace/silken-court");
const Ansurek = require("../models/nerubar-palace/ansurek");

describe("Boss Models Tests", () => {
  it("should create an instance of Ulgrax", () => {
    const ulgrax = new Ulgrax();
    expect(ulgrax.name).toBe("Ulgrax The Devourer");
    expect(ulgrax.encounterId).toBe(1234);
    expect(ulgrax.abilities).toEqual([435152]);
    expect(ulgrax.debuffs).toEqual([]);
    expect(ulgrax.regions).toEqual([-3450, -915, -2500, 510]);
  });

  it("should create an instance of Bloodbound", () => {
    const bloodbound = new Bloodbound();
    expect(bloodbound.name).toBe("The Bloodbound Horror");
    expect(bloodbound.encounterId).toBe(1234);
    expect(bloodbound.abilities).toEqual([444363]);
    expect(bloodbound.debuffs).toEqual([]);
    expect(bloodbound.regions).toEqual([
      -3910.419921875, -1429.1700439453, -2512.5, 666.666015625,
    ]);
  });

  it("should create an instance of Sikran", () => {
    const sikran = new Sikran();
    expect(sikran.name).toBe("Sikran, Captain of the Sureki");
    expect(sikran.encounterId).toBe(1234);
    expect(sikran.abilities).toEqual([434155]);
    expect(sikran.debuffs).toEqual([]);
    expect(sikran.regions).toEqual([-3875, -847.5, -3225, 127.5]);
  });

  it("should create an instance of Rashanan", () => {
    const rashanan = new Rashanan();
    expect(rashanan.name).toBe("Rasha'nan");
    expect(rashanan.encounterId).toBe(1234);
    expect(rashanan.abilities).toEqual([439781]);
    expect(rashanan.debuffs).toEqual([]);
    expect(rashanan.regions).toEqual([-3450, -915, -2500, 510]);
  });

  it("should create an instance of Broodtwister", () => {
    const broodtwister = new Broodtwister();
    expect(broodtwister.name).toBe("Broodtwister Ovi'nax");
    expect(broodtwister.encounterId).toBe(1234);
    expect(broodtwister.abilities).toEqual([442660]);
    expect(broodtwister.debuffs).toEqual([]);
    expect(broodtwister.regions).toEqual([-3875, -262.5, -3125, 862.5]);
  });

  it("should create an instance of Kyveza", () => {
    const kyveza = new Kyveza();
    expect(kyveza.name).toBe("Kyveza");
    expect(kyveza.encounterId).toBe(1234);
    expect(kyveza.abilities).toEqual([437469, 436934]);
    expect(kyveza.debuffs).toEqual([]);
    expect(kyveza.regions).toEqual([-3875, -262.5, -3125, 862.5]);
  });

  it("should create an instance of SilkenCourt", () => {
    const silkenCourt = new SilkenCourt();
    expect(silkenCourt.name).toBe("The Silken Court");
    expect(silkenCourt.encounterId).toBe(2921);
    expect(silkenCourt.abilities).toEqual([]);
    expect(silkenCourt.debuffs).toEqual([438708]);
    expect(silkenCourt.regions).toEqual([-3875, -262.5, -3125, 862.5]);
  });

  it("should create an instance of Ansurek", () => {
    const ansurek = new Ansurek();
    expect(ansurek.name).toBe("Queen Ansurek");
    expect(ansurek.encounterId).toBe(1234);
    expect(ansurek.abilities).toEqual([439865]);
    expect(ansurek.debuffs).toEqual([445152]);
    expect(ansurek.regions).toEqual([
      -3911.1499023438, 239.99266052246, -3463.8500976562, 910.9423828125,
    ]);
  });
});

describe("Boss Factory Tests", () => {
  it("should create a Ulgrax instance", () => {
    const boss = createBossInstance("Ulgrax The Devourer");
    expect(boss).toBeInstanceOf(Ulgrax);
  });

  it("should create a Bloodbound instance", () => {
    const boss = createBossInstance("The Bloodbound Horror");
    expect(boss).toBeInstanceOf(Bloodbound);
  });

  it("should create a Sikran instance", () => {
    const boss = createBossInstance("Sikran, Captain of the Sureki");
    expect(boss).toBeInstanceOf(Sikran);
  });

  it("should create a Rashanan instance", () => {
    const boss = createBossInstance("Rasha'nan");
    expect(boss).toBeInstanceOf(Rashanan);
  });

  it("should create a Broodtwister instance", () => {
    const boss = createBossInstance("Broodtwister Ovi'nax");
    expect(boss).toBeInstanceOf(Broodtwister);
  });

  it("should create a Kyveza instance", () => {
    const boss = createBossInstance("Nexus-Princess Ky'veza");
    expect(boss).toBeInstanceOf(Kyveza);
  });

  it("should create a Silken Court instance", () => {
    const boss = createBossInstance("The Silken Court");
    expect(boss).toBeInstanceOf(SilkenCourt);
  });

  it("should create an Ansurek instance", () => {
    const boss = createBossInstance("Queen Ansurek");
    expect(boss).toBeInstanceOf(Ansurek);
  });

  it("should throw an error for an unknown boss", () => {
    expect(() => createBossInstance("Unknown Boss")).toThrow(
      'Boss "Unknown Boss" not found'
    );
  });
});
