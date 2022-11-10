FROM node:gallium-alpine3.15
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

CMD ["node", "app.js"]