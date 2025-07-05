FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz  && \
    tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz

CMD ["dockerize", "-wait", "tcp://rabbitmq:5672", "-timeout", "20s", "npm", "run", "start:dev"]
