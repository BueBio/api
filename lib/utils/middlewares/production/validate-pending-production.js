'use strict';

const logger = require('@logger');
const {Production} = require('@models');

function validatePendingProduction(req, res, next) {
    return Production.findById(req.params.id)
        .then((production) => {
            if (!production) {
                return res.status(400).json({
                    code: 'production_not_found',
                    message: 'Production not found'
                });
            }
            if (production.status !== 'pending') {
                return res.status(400).json({
                    code: 'production_is_not_pending',
                    message: 'Production is not pending'
                });
            }
            req.production = production;
            return next();
        })
        .catch((err) => {
            logger.error(`POST /productions/:id/{approve|reject} - validatePendingProduction ${err.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

module.exports = validatePendingProduction;
