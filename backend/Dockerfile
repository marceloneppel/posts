FROM node:latest
RUN mkdir -p /backend
WORKDIR /backend
COPY index.js /backend/
COPY package.json /backend/
RUN npm install
COPY . /backend
EXPOSE 3000
CMD [ "npm", "start" ]
