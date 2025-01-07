const getAccessToken = require("../services/auth-service");
const axios = require("axios"); // Import axios for mocking

describe("getAccessToken", () => {
  beforeEach(() => {
    // Ensure axios is reset before each test case
    jest.clearAllMocks();
  });

  it("should return the access token on successful response", async () => {
    // Mock the axios implementation to return a successful response
    axios.post = jest.fn().mockResolvedValue({
      status: 200,
      data: { access_token: "mock-token" },
    });

    const token = await getAccessToken();

    expect(token).toBe("mock-token"); // Check if the access token is as expected
    expect(axios.post).toHaveBeenCalledTimes(1); // Ensure axios.post was called exactly once
    expect(axios.post).toHaveBeenCalledWith(
      "https://www.warcraftlogs.com/oauth/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ); // Check if axios.post was called with the correct arguments
  });

  it("should throw an error if the response is not 200", async () => {
    // Mock the axios implementation to return a non-200 response
    axios.post = jest.fn().mockResolvedValue({
      status: 400,
      data: { error: "invalid_client" },
    });

    await expect(getAccessToken()).rejects.toThrow(
      'Response was not OK: {"error":"invalid_client"}'
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if axios fails", async () => {
    // Mock axios to simulate a network error
    axios.post = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(getAccessToken()).rejects.toThrow("Network error");
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
