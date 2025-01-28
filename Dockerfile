FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm install
RUN npm run build

EXPOSE 3000
EXPOSE 80

CMD ["npm", "start"]