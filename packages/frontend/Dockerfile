# Build stage
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_REACT_APP_BE_URL
ARG VITE_REACT_APP_STRIPE_PUB_KEY
ENV VITE_REACT_APP_BE_URL=$VITE_REACT_APP_BE_URL
ENV VITE_REACT_APP_STRIPE_PUB_KEY=$VITE_REACT_APP_STRIPE_PUB_KEY

RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
