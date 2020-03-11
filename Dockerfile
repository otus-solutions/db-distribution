FROM node:10.16.0-alpine AS api
COPY source/. src/
WORKDIR /src
ENV MEMORY 6144
ENV DATABASE_USER="distribution"
ENV DATABASE_PASSWORD="distribution"
ENV DATABASE_HOSTNAME="otus-database"
ENV DATABASE_PORT="27017"
EXPOSE 8080
RUN apk update && apk add --no-cache mongodb-tools
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js
