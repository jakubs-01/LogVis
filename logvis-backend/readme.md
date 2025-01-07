# Log Analyzer Backend

## Overview

The Log Analyzer Backend is a Node.js application designed to analyze logs from the Warcraft Logs API. It provides endpoints for fetching fight data, actor data, damage events, debuff events, and more. The application uses MongoDB for data storage and Redis for session management.

## Features

- Fetch and filter fight data from the Warcraft Logs API.
- Retrieve actor data and their associated events.
- Log HTTP requests and responses to MongoDB.
- Use Redis for session management and caching.
- Support for OAuth2 authentication with the Warcraft Logs API.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- Axios
- Jest (for testing)
- GraphQL

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Redis (local or cloud instance)
- A Warcraft Logs API client ID and secret

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/log-analyzer-backend.git
   cd log-analyzer-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/log-analyzer
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_USERNAME=your_redis_username
   REDIS_PASSWORD=your_redis_password
   CLIENT_ID=your_warcraft_logs_client_id
   CLIENT_SECRET=your_warcraft_logs_client_secret
   ENDPOINT_URL=https://www.warcraftlogs.com/api/v2/client
   ENDPOINT_AUTH_URL=https://www.warcraftlogs.com/oauth/token
   USER_AUTH_CALLBACK_ENDPOINT=http://localhost:5000/callback
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

- **GET /login**: Initiates the OAuth2 login process.
- **GET /callback**: Handles the callback from the Warcraft Logs API after authentication.

### Logs

- **GET /logs**: Fetches all logs from the MongoDB database.

### Reports

- **GET /fights**: Retrieves fight data for a given report code.
- **GET /actors**: Retrieves actor data for a given report code.
- **GET /damageevents**: Retrieves damage event data for a given report code.
- **GET /debuffevents**: Retrieves debuff event data for a given report code.
- **GET /closestevent**: Retrieves the closest event to a given timestamp for a target.
- **GET /titleandauthor**: Retrieves the title and author information for a given report.

### Middleware

- **Request Logger**: Logs HTTP requests and responses to MongoDB.

## Testing

To run tests, use the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Warcraft Logs API](https://www.warcraftlogs.com/v2/docs)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
