FROM node:lts-alpine3.10
WORKDIR /tasking-frontend
COPY . /tasking-frontend/
RUN npm install --silent
RUN npm install jquery 
RUN npm install popper.js
RUN npm run build:docker
RUN npm install serve -g
EXPOSE 5551
CMD ["serve", "-s", "build"]