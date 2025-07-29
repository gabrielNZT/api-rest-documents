FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install

RUN npx prisma generate --schema=./src/prisma/schema.prisma

EXPOSE 3000

CMD [ "node", "src/index.js" ]
