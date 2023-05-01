FROM node:18-bullseye-slim

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

ENV HOME=/home/node

WORKDIR $HOME/app

COPY --chown=node:node . .

# update npm
RUN npm install -g npm

RUN npm install

ENV NODE_ENV=production
# Requires SESSION_SECRET for build
ENV SESSION_SECRET=cf6d63747aef3b3180bc19d4a5108f739cfc09408b428c91f936e231d2698431 

RUN npm run build

ENV PORT=3000

EXPOSE ${PORT}

# Create data directory as node user
RUN mkdir -p data
RUN chown node:node data

USER node

CMD ["npm", "start"]
