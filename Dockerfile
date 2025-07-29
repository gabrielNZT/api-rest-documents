FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install

RUN npx prisma generate --schema=./src/prisma/schema.prisma

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD [ "node", "src/index.js" ]
