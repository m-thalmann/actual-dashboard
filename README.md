# Actual Dashboard

## Dev Setup

1. Install the dependencies: `npm install`
1. Copy the `.env.example` file to `.env` within the `apps/backend` folder
1. Start a development Actual server using docker: `npm run actual-server`
   - Open the Actual client: http://localhost:5555
   - Set a server password
   - Create an empty budget file (or import one of yours)
   - Update the server url, password and sync id (Settings → Advanced settings) in the `.env` file
   - Fill it with some data
   - **Note:** The data is persisted to the local `/tmp/container-data` folder
1. Start the backend: `npx nx serve backend`
1. Start the frontend: `npx nx serve frontend`

> API Documentation: http://localhost:3000/docs

## Production Build

`npx nx run-many -t build`

## Deploy with Docker

1. Navigate to the `docker` directory
1. Copy the `.env.docker` file to `.env`
1. Set the environment variables in the `.env` file
1. Run the `docker compose up -d` command

- Alternative: If you need to build for a different actual version than latest use `docker compose build --build-arg ACTUAL_VERSION=<your version>`

1. Access the dashboard at http://localhost:3000
