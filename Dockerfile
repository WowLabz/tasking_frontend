FROM node:lts-alpine3.10
WORKDIR /tasking-frontend
COPY . /tasking-frontend/
RUN yarn install 
RUN yarn add jquery 
RUN yarn add popper.js
RUN yarn start build:docker
RUN yarn add serve -g
EXPOSE 5551
CMD ["serve", "-s", "build"]