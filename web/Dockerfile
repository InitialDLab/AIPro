FROM node:alpine

WORKDIR /app

COPY . /app

RUN npm install
RUN npm install -g serve
RUN npm run build

CMD ["serve", "-s", "build", "--listen", "80"]