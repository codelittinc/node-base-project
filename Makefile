// TODO: Properly organize this file

default: start-dev

start-dev:
  docker-compose up -d && docker exec -it node-graphql-app bash

start:
  docker-compose up && docker logs node-graphql-app --follow

build:
  docker-compose build

stop:
  docker-compose down

db:
  docker-compose up -d db

config:
  cp .env.example .env

db-setup:
  npm run build:tsc && node scripts/db/setup.js

db-setup-test:
  npm run build:tsc && NODE_ENV=test node scripts/db/setup.js
