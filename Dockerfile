FROM node:12-slim

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ADD . brasileirao/

RUN mkdir -p pptruser/Downloads

RUN npm init -y && \
    npm i commander@4.1.0 csv-writer excel4node moment ora@4.0.3 puppeteer typescript \
    && npm install typescript -g \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && chown -R pptruser:pptruser pptruser \
    && chown -R pptruser:pptruser /node_modules \
    && chown -R pptruser:pptruser /package.json \
    && chown -R pptruser:pptruser /package-lock.json \
    && chown -R pptruser:pptruser brasileirao/

USER pptruser

WORKDIR brasileirao/

RUN tsc

CMD ["node", "./dist/run.js"]