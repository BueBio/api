'use strict';
require('dotenv').config();
require('module-alias/register');
const app = require('../app');
const logger = require('@lib/logger');
let application;

return app.connectMongoose()
    .then(() => {
        application = app.initialize();
        return app.beforeInit();
    })
    .then(() => {
        application.listen(process.env.SERVER_PORT);
        logger.info(`Your server is listening on port ${process.env.SERVER_PORT}`);
        app.afterInit();
    })
    .catch((error) => {
        logger.error('APP STOPPED');
        logger.error(error.stack);
        return process.exit(1);
    });
