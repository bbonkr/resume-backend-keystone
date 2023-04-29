FROM node:18-bullseye-slim

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

# Requires SESSION_SECRET for build
ENV SESSION_SECRET=cf6d63747aef3b3180bc19d4a5108f739cfc09408b428c91f936e231d2698431 
ENV NODE_ENV=production

RUN npm run build

ENV PORT=3000

EXPOSE ${PORT}

CMD ["npm", "start"]
