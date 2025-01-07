# LogVis - WoW Log Analyzer

LogVis is a web application designed to analyze and visualize World of Warcraft raid logs. It provides interactive visualizations of raid encounters, ability timelines, and player positioning data using the Warcraft Logs API.

## Features

- 🔐 **Private Logs Access**: Authenticate with your Warcraft Logs account to analyze private reports
- 🗺️ **Interactive Maps**: Visualize raid mechanics and positioning with detailed encounter maps
- 📊 **Ability Timeline**: Track boss ability usage and important events throughout fights
- 📱 **Responsive Design**: Full support for desktop and mobile devices
- 🔄 **Real-time Updates**: Live data synchronization during ongoing encounters
- 🎨 **Dark Mode**: Eye-friendly dark theme optimized for gamers

## Architecture

The project consists of two main components:

### Frontend

- Built with React.js
- Material-UI for component styling
- D3.js and Recharts for data visualization
- Leaflet for interactive maps

### Backend

- Node.js with Express
- MongoDB for data storage
- Redis for session management and caching
- GraphQL integration with Warcraft Logs API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Redis (local or cloud instance)
- Warcraft Logs API credentials

### Installation

1. Clone both repositories:

```bash
git clone https://github.com/yourusername/logvis-frontend.git
git clone https://github.com/yourusername/logvis-backend.git
```

2. Navigate to the frontend directory and install dependencies:

```bash
cd logvis-frontend
npm install
```

3. Navigate to the backend directory and install dependencies:

```bash
cd logvis-backend
npm install
```

4. Set up environment variables:

```bash
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
plaintext
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TITLE_AND_AUTHOR_API_URL=/api/titleandauthor
REACT_APP_FIGHTS_API_URL=/api/fights
```

## Development

### Running locally with Docker

Use Docker Compose for development:

```bash
docker-compose -f docker-compose.dev.yml up
```

### Running locally without Docker

1. Run the backend server:

```bash
cd logvis-backend
npm run dev
```

2. Run the frontend server:

```bash
cd logvis-frontend
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Testing

### Backend Tests

```bash
cd logvis-backend
npm test # Run unit tests
npm run test:integration # Run integration tests
npm run test:all # Run all tests
```

### Frontend Tests

```bash
cd logvis-frontend
npm test
```

## Deployment

The project uses GitHub Actions for CI/CD. Pushing to the main branch triggers automatic deployment.

Reference deployment workflow:

```yaml
.github/workflows/deploy.yml
```

## API Documentation

### Authentication Endpoints

- `GET /auth/login` - Initiates OAuth2 login
- `GET /auth/callback` - Handles OAuth2 callback

### Report Endpoints

- `GET /api/fights` - Retrieve fight data
- `GET /api/actors` - Retrieve actor data
- `GET /api/damageevents` - Get damage events
- `GET /api/debuffevents` - Get debuff events
- `GET /api/titleandauthor` - Get report metadata

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Warcraft Logs API](https://www.warcraftlogs.com/v2/docs)
- [Material-UI](https://mui.com/)
- [React.js](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
