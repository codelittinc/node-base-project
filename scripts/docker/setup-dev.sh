docker-compose -c docker-compose.development.yml up -d 
docker exec -it node-graphql-app npm run db:create:all