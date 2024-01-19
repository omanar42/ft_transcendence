FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# RUN npm run build

EXPOSE 3000

CMD npm run migrate:dev && npm run start:dev
