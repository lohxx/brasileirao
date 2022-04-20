FROM node:14-bullseye-slim

ADD . brasileirao/

WORKDIR brasileirao/

RUN npm install .

RUN npm run build

CMD ["node", "dist/run.js"]