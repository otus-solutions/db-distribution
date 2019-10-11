FROM mongo:4.0.4 AS database
ARG INITDB_FILE=server/database/initdb.sh
ENV MONGO_INITDB_ROOT_USERNAME="admin"
ENV MONGO_INITDB_ROOT_PASSWORD="admin"
ENV MONGO_INITDB_DATABASE="admin"
ENV DATABASE_USER="user"
ENV DATABASE_PASSWORD="user"
USER root
COPY server/database/initdb /initdb
COPY ${INITDB_FILE} /docker-entrypoint-initdb.d/
EXPOSE 27017

FROM node:10.16.0-alpine AS api
COPY source/. src/
WORKDIR /src
ENV MEMORY 6144
ENV DATABASE_USER="user"
ENV DATABASE_PASSWORD="user"
ENV DATABASE_HOSTNAME="db-distribution-database"
ENV DATABASE_PORT="27017"
EXPOSE 8080
RUN apk update && apk add --no-cache mongodb-tools
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js
