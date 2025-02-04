FROM node:16-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM node:16-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

RUN mkdir -p /app/persistence && chown -R appuser:appgroup /app/persistence
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER appuser

CMD ["npm", "start"]
