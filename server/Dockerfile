FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=35000
EXPOSE 35000
CMD [ "node", "server.js" ]