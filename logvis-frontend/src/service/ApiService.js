import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const API_ENDPOINTS = {
  LOGS: process.env.REACT_APP_LOGS_API_URL,
  QUERY_LOGS: process.env.REACT_APP_QUERY_LOGS_API_URL,
  USER: process.env.REACT_APP_USER_DATA_API_URL,
  TITLE_AUTHOR: process.env.REACT_APP_TITLE_AND_AUTHOR_API_URL,
  FIGHTS: process.env.REACT_APP_FIGHTS_API_URL,
  IP_INFO: process.env.REACT_APP_IPINFO_API_URL,
  ABILITY_VISIBILITY: process.env.REACT_APP_ABILITY_VISIBILITY_API_URL,
  DAMAGE_EVENTS: process.env.REACT_APP_DAMAGE_EVENTS_API_URL,
  DEBUFF_EVENTS: process.env.REACT_APP_DEBUFF_EVENTS_API_URL,
};

const apiService = {
  executeApiCall: async (endpoint, params = null) => {
    try {
      const response = await apiClient.get(
        endpoint,
        params ? { params } : undefined
      );
      return response;
    } catch (error) {
      console.log(error);
      return this.handleError(error);
    }
  },

  getLogs: async () => await apiService.executeApiCall(API_ENDPOINTS.LOGS),

  getQueryLogs: async () =>
    await apiService.executeApiCall(API_ENDPOINTS.QUERY_LOGS),

  getUserData: async () => await apiService.executeApiCall(API_ENDPOINTS.USER),

  getTitleAndAuthor: async (reportCode) =>
    await apiService.executeApiCall(API_ENDPOINTS.TITLE_AUTHOR, { reportCode }),

  getFights: async (reportCode) =>
    await apiService.executeApiCall(API_ENDPOINTS.FIGHTS, { reportCode }),

  getIpInfo: async (ip) =>
    await apiService.executeApiCall(API_ENDPOINTS.IP_INFO, { ip }),

  getAbilityVisibility: async () =>
    await apiService.executeApiCall(API_ENDPOINTS.ABILITY_VISIBILITY),

  getDamageEvents: async (reportCode, bossName, fightIDs) =>
    await apiService.executeApiCall(API_ENDPOINTS.DAMAGE_EVENTS, {
      reportCode,
      bossName,
      fightIDs,
    }),

  getDebuffEvents: async (reportCode, bossName, fightIDs) =>
    await apiService.executeApiCall(API_ENDPOINTS.DEBUFF_EVENTS, {
      reportCode,
      bossName,
      fightIDs,
    }),

  handleError: (error) => {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "Server Error",
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        status: 503,
        message: "Service Unavailable",
        data: null,
      };
    } else {
      return {
        status: 400,
        message: error.message || "Request failed",
        data: null,
      };
    }
  },
};

export default apiService;
