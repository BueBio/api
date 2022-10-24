'use strict';

const express = require('express');
const router = express.Router();
const {ProductionRewardCode} = require('@lib/models');
const logger = require('@lib/logger');

function validateCode(req, res) {
    return ProductionRewardCode.findOne({
        code: req.params.code,
        status: 'available'
    })
        .populate('production')
        .then((productionRewardCode) => {
            if (!productionRewardCode) {
                return res.status(400).json({
                    code: 'invalid_or_used_code',
                    message: 'Invalid or used reward code'
                });
            }
            return res.status(200).json(productionRewardCode);
        })
        .catch((error) => {
            logger.error(`GET /api/codes/validate/:code - validateCode error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.get(
    '/codes/validate/:code',
    validateCode
);

module.exports = router;
