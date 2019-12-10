docker-compose up -d
docker exec -it node-api npm run db:create:all
docker exec -it node-api npm run start:dev
docker logs node-api --follow
