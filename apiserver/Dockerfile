FROM node:16-slim
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci

COPY ./index.js ./

CMD [ "npm", "start" ]
