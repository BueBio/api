'use strict';

const logger = require('@logger');

function changeStateProduction(newState) {
    return function(req, res) {
        req.production.status = newState;
        req.production.publishedAt = new Date();
        return req.production.save()
            .then(() => {
                return res.status(200).json({});
            })
            .catch((err) => {
                logger.error(`POST /productions/:id/{approve|reject} - changeStateProduction ${err.message}`);
                return res.status(500).json({
                    code: 'internal_error',
                    message: 'Internal error'
                });
            });
    };
}

module.exports = changeStateProduction;
