FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x run.sh

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
