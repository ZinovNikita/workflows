ARG NODE_VERSION
ARG WSPORT

FROM node:$NODE_VERSION-alpine

WORKDIR /opt/src

COPY package.json ./
RUN npm install
COPY . .

EXPOSE $WSPORT

CMD [ "npm", "run", "build" ]
