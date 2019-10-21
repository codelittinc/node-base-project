# TODO: Properly organize this file
TODAY = $(shell date +%Y%m%d)

default:  start.dev

start.dev:
	docker-compose up -d && docker exec -it node-graphql-app bash

start:
	docker-compose up -d && docker exec -it node-graphql-app npm run start-dev && docker logs node-graphql-app --follow

start.all:
	docker-compose up -d && docker exec -it node-graphql-app make db.create.full && docker exec -it node-graphql-app npm run start-dev && docker logs node-graphql-app --follow

build:
	docker-compose build

stop:
	docker-compose down

db:
	docker-compose up -d db

config:
	cp .env.example .env

db.setup:
	npm run build:tsc && node scripts/db/setup.js

db.setup.test:
	npm run build:tsc && NODE_ENV=test node scripts/db/setup.js

db.migrate.create:
	touch ./src/db/migrations/$(TODAY).$(name).up.sql
	touch ./src/db/migrations/$(TODAY).$(name).down.sql

db.create:
	node scripts/db/setup.js && npm run db:migrate up 

db.create.test:
	NODE_ENV=test node scripts/db/setup.js && NODE_ENV=test npm run db:migrate up

db.create.full:
	npm run build:tsc && make db.create && make db.create.test