# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim

RUN apt-get update && apt-get install make

WORKDIR /share

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

ADD ./ /share

# Bind to all network interfaces so that it can be mapped to the host OS
EXPOSE ${SERVER_PORT}
