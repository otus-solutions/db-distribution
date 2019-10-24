# NETWORK
sudo docker network create -d bridge db-distribution-network

# DATABASE - BUILD IMAGE
sudo docker build --target database -t db-distribution-database .

# DATABASE - BUILD CONTAINER
sudo docker run -v $(pwd)/persistence:/data/db --network=db-distribution-network -p 53001:27017 --name db-distribution-database db-distribution-database --wiredTigerCacheSizeGB='1.2'

# API - BUILD IMAGE
sudo docker build --target api -t db-distribution-api .

# API - BUILD CONTAINER
sudo docker run --network=db-distribution-network -p 53002:8080 --name db-distribution-api db-distribution-api
