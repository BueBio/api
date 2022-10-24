'use strict';
const router = require('express').Router();
const logger = require('@logger');
const Joi = require('joi');
const validateBodyFields = require('@utils/middlewares/validate-body-fields');
const {BlockchainTransaction, Production, ProductionRewardCode} = require('@models');

function findRewardCode(req, res, next) {
    return ProductionRewardCode.findOne({
        code: req.body.code,
        status: 'available'
    })
        .populate('production')
        .then((rewardCode) => {
            if (!rewardCode) {
                return res.status(400).json({
                    code: 'invalid_or_used_code',
                    message: 'Invalid or used reward code'
                });
            }
            req.rewardCode = rewardCode;
            return next();
        })
        .catch((error) => {
            logger.error(`POST /api/tokens/impacttoken/assign - findRewardCode error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function transferAndUpdate(req, res) {
    req.rewardCode.status = 'used';
    req.rewardCode.walletAddress = req.body.wallet;
    const availableQuantity = req.rewardCode.production.availableQuantity - 1;
    return Promise.all([
        BlockchainTransaction.create({
            type: 'IMPACTTOKEN_ASSIGN',
            status: 'PENDING',
            references: {
                production: req.rewardCode.production,
                productionRewardCode: req.rewardCode._id
            }
        }),
        req.rewardCode.save(),
        Production.findByIdAndUpdate(req.rewardCode.production._id, {
            $set: {
                availableQuantity
            }
        })
    ])
        .then(() => {
            return res.status(200).json({});
        })
        .catch((error) => {
            logger.error(`POST /api/tokens/impacttoken/assign - findRewardCode error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Assign an impact-token
* @description An user claims an impact-token using a reward-code
* @route {POST} /api/tokens/impacttoken/assign
* @bodyparam {string} [code] Reward code
* @bodyparam {string} [wallet] Wallet address to send the token
* @response {200} OK
* @response {400} Invalid reward code
* @responsebody {string} [code] invalid_code
* @responsebody {string} [message] error description
* @response {400} Invalid fields
* @responsebody {string} [code] invalid_fields
* @responsebody {string} [message] error description
* @response {400} Reward code already used
* @responsebody {string} [code] code_already_used
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.post(
    '/tokens/impacttoken/assign',
    validateBodyFields(Joi.object({
        code: Joi.string().required(),
        wallet: Joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required()
    })),
    findRewardCode,
    transferAndUpdate
);

module.exports = router;
