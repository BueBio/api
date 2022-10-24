'use strict';

const {FutureProductionOffer} = require('@models');
const logger = require('@logger');

function validatePendingFutureProduction(req, res, next) {
    return FutureProductionOffer.findById(req.params.id)
        .then((futureProduction) => {
            if (!futureProduction) {
                return res.status(400).json({
                    code: 'future_production_not_found',
                    message: 'Future production not found'
                });
            }
            if (futureProduction.status !== 'pending') {
                return res.status(400).json({
                    code: 'future_production_is_not_pending',
                    message: 'Future production is not pending'
                });
            }
            req.futureProduction = futureProduction;
            return next();
        })
        .catch((err) => {
            logger.error(`POST /futureproductionoffers/:id/{approve|reject} - validatePendingFutureProduction ${err.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

module.exports = validatePendingFutureProduction;
