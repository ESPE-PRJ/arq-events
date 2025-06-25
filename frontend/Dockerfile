FROM oven/bun:1.2.2 AS base

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM oven/bun:1.2.2 AS release

COPY --from=base /usr/src/app/node_modules node_modules

COPY  . .

RUN bun --bun run build

ARG SERVER_PORT

EXPOSE ${SERVER_PORT}

CMD ["bun", "--bun", "run", "start"]