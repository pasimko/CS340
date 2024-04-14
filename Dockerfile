FROM node:21
WORKDIR /app

COPY package*.json ./

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run writeDB

CMD ["node", "index.js"]
# CMD ["npm", "run", "build-frontend"]
# CMD ["npm", "run", "backend"]
# CMD ["npm", "run", "writeDB"]
