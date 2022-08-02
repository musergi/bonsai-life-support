# syntax=docker/dockerfile:1

# Base image for all other images
FROM node:16 as base

# Set the working directory
WORKDIR /usr/local/src/app

# Install npm dependencies
COPY package*.json ./
RUN npm install

# Starts the server
FROM base as serve

# Expose API port
EXPOSE ${SERVER_PORT}

# Run server using npm command
CMD [ "npm", "start" ]


# Run tests
FROM base as test

# Run tests using npm command
CMD [ "npm", "test" ]