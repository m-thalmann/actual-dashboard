FROM node:20-alpine AS build

RUN mkdir -p /app/src
WORKDIR /app/src

COPY . .

RUN npm ci
RUN NX_DAEMON=false npx nx build backend
RUN NX_DAEMON=false npx nx build frontend --baseHref /app/ --configuration docker

RUN cp -r dist/apps/frontend/browser/* dist/apps/backend/client

FROM node:20-alpine

RUN mkdir -p /app/src
WORKDIR /app/src

COPY --from=build /app/src/dist/apps/backend .
RUN npm ci

CMD [ "node", "main.js" ]
