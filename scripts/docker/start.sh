docker-compose up -d 
# @TODO: update this script to only create the normal database
docker exec -it node-graphql-app npm run db:create:all
# @TODO: update this script to use the production Dockerfile
docker exec -it node-graphql-app npm run start:dev
docker logs node-graphql-app --follow