FROM node:latest
RUN mkdir -p /backend
WORKDIR /backend
COPY backend /backend/
RUN npm install
EXPOSE 3000
ARG COMMAND
ENV COMMAND ${COMMAND}
CMD npm ${COMMAND}
