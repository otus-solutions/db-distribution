# NETWORK
sudo docker network create -d bridge db-network

# DATABASE - BUILD CONTAINER
sudo docker run -v $(pwd)/persistence:/data/db --network=db-network -p 53001:27017 --name db-database db-database --wiredTigerCacheSizeGB='1.2'

# API - BUILD IMAGE
sudo docker build --target api -t db-api .

# API - BUILD CONTAINER
sudo docker run --network=db-network -p 53002:8080 --name db-api db-api
