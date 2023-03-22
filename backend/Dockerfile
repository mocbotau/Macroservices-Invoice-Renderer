FROM node:16-alpine

RUN mkdir -p /app

WORKDIR /app

VOLUME /app/persistence

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
