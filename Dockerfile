FROM node:13.13.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1337
CMD [ "node", "index.js" ]