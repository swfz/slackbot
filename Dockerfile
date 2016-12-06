FROM node:7

RUN mkdir /botkit
WORKDIR /botkit

RUN npm install botkit

VOLUME ["/botkit"]

ENTRYPOINT ["node", "app.js"]

