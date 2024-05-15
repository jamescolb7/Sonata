FROM node:lts-alpine3.19

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npx prisma migrate deploy
RUN npm run build

EXPOSE 3000

# Needed for Deezer downloads to work with > Node 16
ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["npm", "run", "prod:start"]