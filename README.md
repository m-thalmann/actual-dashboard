# Actual Dashboard

## Dev Setup

1. Install the dependencies: `npm install`
1. Copy the `.env.example` file to `.env`
1. Start a development Actual server: `docker compose -f docker-compose.dev.yml up`
   - Open the Actual client: http://localhost:5555
   - Set a server password
   - Create an empty budget file (or import one of yours)
   - Update the server url, password and sync id (Settings → Advanced settings) in the `.env` file
   - Fill it with some data
   - **Note:** The data is persisted to the local `/tmp/container-data` folder
1. Start the backend: `npx nx serve backend`
1. Start the frontend: `npx nx serve frontend`

## Production Build

`npx nx run-many -t build`
