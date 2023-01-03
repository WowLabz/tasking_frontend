FROM node:lts-alpine3.10
WORKDIR /tasking-frontend
COPY . /tasking-frontend/
RUN yarn install 
RUN yarn add jquery 
RUN yarn add popper.js
EXPOSE 9001

CMD [ "yarn", "start" ]