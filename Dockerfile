FROM node:19.1-alpine

WORKDIR /app

# ARG NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src

RUN npm i -g @nestjs/cli
RUN npm i
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
