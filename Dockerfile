FROM node:lts-alpine3.19

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir database
RUN npm run migrate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod:start"]