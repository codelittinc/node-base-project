default: start

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
