FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x run.sh

EXPOSE 3000

CMD [ "sh", "./run.sh" ]
