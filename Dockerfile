# Install dependencies only
FROM node:20-bullseye-slim AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# 
FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner

USER node

WORKDIR /usr/src/app

COPY --from=builder --chown=nextjs:node . .

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["npm", "start"]
