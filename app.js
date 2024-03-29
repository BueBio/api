'use strict';
const express = require('express');
const path = require('path');
const logger = require('@logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('@lib/routes');
const expressWinston = require('express-winston');
const app = express();
const cors = require('cors');
const publicPaths = require('./config/public-paths');
const extractJwt = require('@utils/extract-jwt');
const scheduleRunner = require('@utils/schedule-runner');
const createDefaultAdmin = require('@utils/create-default-admin');
const {initialize: initializeBlockchain} = require('@utils/blockchain');
require('@utils/events-listeners');

function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB, {useNewUrlParser: true});
}

function initialize() {
    app.use(expressWinston.logger({
        winstonInstance: logger,
        expressFormat: true,
        colorize: false,
        meta: false,
        statusLevels: true
    }));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use('/public', express.static(path.join(__dirname, 'public')));

    app.get(publicPaths.regex('get'), extractJwt);
    app.put(publicPaths.regex('put'), extractJwt);
    app.post(publicPaths.regex('post'), extractJwt);
    app.delete(publicPaths.regex('delete'), extractJwt);
    Object.keys(routes).forEach((key) => {
        app.use('/api', routes[key]);
    });
    const buildHiroki = require('./build-hiroki');
    app.use(buildHiroki());

    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        let error = {};
        error.status = err.status;
        if (req.app.get('env') === 'development') {
            error.message = err.message;
            error.stack = err.stack;
        }
        return res.status(err.status || 500).json({
            error
        });
    });

    return app;
}

async function beforeInit() {
    await initializeBlockchain();
}

async function afterInit() {
    scheduleRunner();
    createDefaultAdmin();
}

module.exports = {
    initialize,
    connectMongoose,
    beforeInit,
    afterInit
};
