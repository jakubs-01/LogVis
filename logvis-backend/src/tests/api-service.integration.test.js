const WarcraftLogsAPI = require("../services/api-service");

describe("WarcraftLogs API Integration Tests", () => {
  let api;
  let reportCode;
  let fightId;
  let abilityId;
  let startTime;
  let targetId;
  beforeEach(async () => {
    api = new WarcraftLogsAPI.WarcraftLogsAPI();
    await api.initialize();
    reportCode = "2zy4D9wjAqNXYCWQ";
    fightId = 45;
    abilityId = 437469;
    startTime = 10000;
    targetId = 6;
  });

  it("should fetch title and author", async () => {
    const result = await api.fetchTitleAndAuthor(reportCode, undefined);
    expect(result.data.reportData.report.title).toBeDefined();
    expect(result.data.reportData.report.owner.name).toBeDefined();
  });

  it("should fetch fights", async () => {
    const result = await api.fetchFights(reportCode, undefined);
    expect(result.data.reportData.report.fights).toBeDefined();
    expect(Array.isArray(result.data.reportData.report.fights)).toBe(true);
  });

  it("should fetch actors", async () => {
    const result = await api.fetchActors(reportCode, undefined);
    expect(result.data.reportData.report.masterData.actors).toBeDefined();
    expect(Array.isArray(result.data.reportData.report.masterData.actors)).toBe(
      true
    );
  });

  it("should fetch damage events", async () => {
    const result = await api.fetchDamageEvents(
      reportCode,
      abilityId,
      fightId,
      undefined
    );
    expect(result.data.reportData.report.events.data).toBeDefined();
    expect(Array.isArray(result.data.reportData.report.events.data)).toBe(true);
  });

  it("should fetch debuff events", async () => {
    const result = await api.fetchDebuffEvents(
      reportCode,
      abilityId,
      fightId,
      undefined
    );
    expect(result.data.reportData.report.events.data).toBeDefined();
    expect(Array.isArray(result.data.reportData.report.events.data)).toBe(true);
  });

  it("should fetch fight start time", async () => {
    const result = await api.fetchFightStartTime(
      reportCode,
      fightId,
      undefined
    );
    expect(result.data.reportData.report.fights).toBeDefined();
  });

  it("should fetch closest event", async () => {
    const result = await api.fetchClosestEvent(
      reportCode,
      targetId,
      startTime,
      fightId,
      undefined
    );
    expect(result.data.reportData.report.events.data).toBeDefined();
  });

  it("should fetch from cache if available", async () => {
    const startTimeFirstCall = performance.now();
    const result = await api.fetchClosestEvent(
      reportCode,
      targetId,
      startTime,
      fightId,
      undefined
    );
    expect(result.data.reportData.report.events.data).toBeDefined();
    const endTimeFirstCall = performance.now();

    const startTimeSecondCall = performance.now();
    const cachedResult = await api.fetchClosestEvent(
      reportCode,
      targetId,
      startTime,
      fightId,
      undefined
    );

    const endTimeSecondCall = performance.now();

    const firstCallDuration = endTimeFirstCall - startTimeFirstCall;
    const secondCallDuration = endTimeSecondCall - startTimeSecondCall;
    expect(cachedResult.data.reportData.report.events.data).toEqual(
      result.data.reportData.report.events.data
    );
    expect(secondCallDuration).toBeLessThan(firstCallDuration);
  });

  it("should throw an error if the report code is invalid", async () => {
    await expect(api.fetchFights("invalid", undefined)).rejects.toThrow(
      "GraphQL Error:"
    );
  });
});
