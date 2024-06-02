FROM node:21
WORKDIR /app

COPY package*.json ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "app.js"]
