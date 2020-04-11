FROM node:8.11.3-slim

WORKDIR /home/node/routific

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD npm run dev