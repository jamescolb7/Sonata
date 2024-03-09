FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
RUN bun run build
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]