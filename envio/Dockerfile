FROM node:22-alpine

ENV TZ=America/Guayaquil

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ARG SERVER_PORT
ARG SERVER_HOST

EXPOSE ${SERVER_PORT}

HEALTHCHECK --interval=300s --timeout=3s --start-period=2s --retries=3 \
    CMD wget --spider --quiet http://${SERVER_HOST}:${SERVER_PORT}/health || exit 1

CMD ["node", "dist/src/main"]