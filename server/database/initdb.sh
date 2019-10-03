cd /initdb

mongo --eval "var USER='$MONGO_INITDB_ROOT_USERNAME'; var PASS='$MONGO_INITDB_ROOT_PASSWORD';" db-roles.js

mongo --eval "var USER='$DATABASE_USER'; var PASS='$DATABASE_PASSWORD';" db-user.js

