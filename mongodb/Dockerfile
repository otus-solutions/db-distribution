FROM mongo:4.0
COPY ./config/mongo.conf /etc/mongo.conf
ENV MONGO_INITDB_ROOT_USERNAME root
ENV MONGO_INITDB_ROOT_PASSWORD XRYs9yjU
EXPOSE 27017
CMD ["mongod","--auth","-f", "/etc/mongo.conf"]