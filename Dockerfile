FROM node:18-bullseye-slim

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /usr/src/app

COPY --chown=node:node . .

# update npm
RUN npm install -g npm

RUN npm install

ENV NODE_ENV=production
# Requires SESSION_SECRET for build
ENV SESSION_SECRET=cf6d63747aef3b3180bc19d4a5108f739cfc09408b428c91f936e231d2698431 

RUN npm run build

RUN chown -R node:node /usr/src/app

ENV PORT=3000

EXPOSE ${PORT}

USER node

CMD ["npm", "start"]
