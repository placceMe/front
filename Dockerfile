# Use official Node.js image for build
FROM node:20 AS build
ARG BASE_URL
ENV BASE_URL=http://31.42.190.94:8080
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Use a lightweight image to serve the build
FROM node:20-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
