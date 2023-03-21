FROM node:16-alpine

RUN mkdir -p /app/backend

WORKDIR /app/backend

VOLUME /app/backend/persistence

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
