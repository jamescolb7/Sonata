FROM node:lts-alpine3.19

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma migrate deploy
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod:start"]