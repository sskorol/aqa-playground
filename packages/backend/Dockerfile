FROM node:16-alpine as development

WORKDIR /app
COPY tsconfig*.json ./
COPY package*.json ./
RUN npm install
COPY src/ src/
RUN npm run build

FROM node:16-alpine as production

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=development /app/dist/ ./dist/
EXPOSE 9090
CMD [ "node", "dist/main.js" ]