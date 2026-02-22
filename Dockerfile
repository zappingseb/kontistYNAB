FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm i && \
  npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --production && \
  npm cache clean --force && \
  rm -rf /root/.npm
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "/app/dist/app.js"]