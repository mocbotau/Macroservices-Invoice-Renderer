FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev

COPY .env.prod ./.env
COPY . .

CMD ["npm", "start"]
