FROM node:10.16.0-alpine
COPY api/. src/
WORKDIR /src
ENV MEMORY 6144
EXPOSE 8080
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js