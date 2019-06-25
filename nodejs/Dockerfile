FROM node:8-alpine
COPY api/. src/
WORKDIR /src
ENV MEMORY 2048
EXPOSE 8080
CMD node --max-old-space-size=$MEMORY --optimize-for-size app.js