'use strict';
const express = require('express');
const router = express.Router();
const haveAnyRole = require('@utils/middlewares/have-any-role');
const {Production, ProductionRewardCode} = require('@lib/models');
const logger = require('@lib/logger');

function findProduction(req, res, next) {
    return Production.findById(req.params.id)
        .then((production) => {
            if (!production) {
                return res.status(400).json({
                    code: 'invalid_production',
                    message: 'Invalid production'
                });
            }
            if (req.user.role === 'producer' && production.producer.toString() !== req.user.producer.toString()) {
                return res.status(401).json({
                    code: 'unauthorized',
                    message: 'Unauthorized'
                });
            }
            return next();
        })
        .catch((error) => {
            logger.error(`GET /api/productions/:id/codes - findProduction error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function returnCodes(req, res) {
    return ProductionRewardCode.find({
        production: req.params.id
    })
        .then((codes) => {
            return res.status(200).json(codes);
        })
        .catch((error) => {
            logger.error(`GET /api/productions/:id/codes - returnCodes error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Get reward codes of a production
* @description Returns all reward codes of a production with status
* @route {GET} /api/productions/:id/codes
* @bodyparam {string} [id] Production identifier
* @response {200} OK
* @responsebody {string} [token] JWT Token
* @response {401} Authentication error
* @responsebody {string} [code] authentication_failed
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.get(
    '/productions/:id/codes',
    haveAnyRole(['admin', 'producer']),
    findProduction,
    returnCodes
);

module.exports = router;
