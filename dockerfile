FROM node:8.9.1

WORKDIR /usr/app
COPY package*.json /usr/app/

RUN npm install 
COPY . .

RUN npm run build
