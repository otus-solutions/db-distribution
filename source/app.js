var app = require("./config/server");
const mongoose = require("mongoose");
const listEndpoints = require('express-list-endpoints');

const {
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOSTNAME,
    DATABASE_PORT
} = process.env;

const port = 8080;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    socketTimeoutMS: 0,
    connectTimeoutMS: 0 ,
    keepAlive: 1,
    auth: {
        user: DATABASE_USER,
        password: DATABASE_PASSWORD
    }
};

const url = `mongodb://${DATABASE_HOSTNAME}:${DATABASE_PORT}/db-distribution?authSource=db-distribution`;

connect();

function listen() {
    app.listen(port);
    console.log('Express app started on port ' + port);
}

function connect() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect)
        .once('open', listen);
    endpointsList();
    return mongoose.connect(url, options);
}

function endpointsList(){
    let endpoints = listEndpoints(app);
    console.table(endpoints)
}


