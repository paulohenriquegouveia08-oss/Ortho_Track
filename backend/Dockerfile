FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

RUN mkdir -p /app/uploads/apk

EXPOSE 3004

CMD ["npm", "run", "start:prod"]
