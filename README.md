# Rug Pull Simulator Backend

This is the backend service for the Rug Pull Simulator leaderboard system, designed to be deployed on Railway.

## Features

- In-memory leaderboard storage
- REST API for leaderboard management
- CORS configured for the frontend

## API Endpoints

- `GET /leaderboard` - Get the top 100 leaderboard entries
- `POST /leaderboard` - Add a new leaderboard entry
- `DELETE /leaderboard` - Clear the leaderboard (admin only)
- `GET /health` - Health check endpoint

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Deployment on Railway

1. Push this code to a GitHub repository
2. Go to [Railway](https://railway.app/)
3. Create a new project from your GitHub repo
4. Select the Node.js template
5. Set the environment variables if needed
6. Deploy the application
7. The service will be available at `https://rugpullsimulator-production.up.railway.app/`

## Environment Variables

- `PORT` - The port to run the server on (defaults to 3001)

## Leaderboard Data Structure

```json
{
  "id": 1629492982,
  "playerName": "SatoshiWannabe",
  "tokenName": "Moon Rocket",
  "tokenSymbol": "MOON",
  "finalScore": 100000,
  "holders": 5000,
  "rugPullHolders": 5000,
  "marketCap": 50000,
  "tickCount": 120,
  "date": "2023-01-01T12:00:00.000Z"
}
``` 