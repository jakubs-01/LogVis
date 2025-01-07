const Log = require("../models/log");
const logDbService = require("../services/log-db-service");

jest.mock("../models/log"); // Mock the Log model

describe("Log DB Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should fetch all logs successfully", async () => {
    const mockLogs = [
      {
        _id: "1",
        request: {
          method: "GET",
          url: "/api/logs",
          headers: { "Content-Type": "application/json" },
          body: {},
          timestamp: new Date(),
          ip: "192.168.1.1",
        },
        response: {
          statusCode: 200,
          duration: 150,
          firstDataPiece: { message: "Success" },
        },
      },
      {
        _id: "2",
        request: {
          method: "POST",
          url: "/api/logs",
          headers: { "Content-Type": "application/json" },
          body: { data: "test" },
          timestamp: new Date(),
          ip: "192.168.1.2",
        },
        response: {
          statusCode: 201,
          duration: 200,
          firstDataPiece: { message: "Created" },
        },
      },
    ];

    Log.find.mockResolvedValue(mockLogs); // Mock the find method to return mockLogs

    const logs = await logDbService.getAllLogs();

    expect(logs).toEqual(mockLogs); // Check if the returned logs match the mock
    expect(Log.find).toHaveBeenCalledTimes(1); // Ensure find was called once
  });

  it("should throw an error if fetching logs fails", async () => {
    const errorMessage = "Database error";
    Log.find.mockRejectedValue(new Error(errorMessage)); // Mock the find method to throw an error

    await expect(logDbService.getAllLogs()).rejects.toThrow(errorMessage); // Expect the function to throw the error
  });
});
