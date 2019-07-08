FROM node:10.16.0-alpine
COPY api/. src/
WORKDIR /src
ENV MEMORY 6144
EXPOSE 8080
RUN apk update && apk add --no-cache mongodb-tools
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js