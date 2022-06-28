'use strict';
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const logger = require('@lib/logger');
const {Vault, WalletVault, WalletMovement} = require('@models');
const {validateBodyFields} = require('@middlewares/general');

function findVault(req, res, next) {
    return Vault.findOne({
        _id: req.body.vault
    })
        .then((vault) => {
            if (!vault) {
                return res.status(400).json({
                    code: 'invalid_vault',
                    message: 'Invalid vault'
                });
            }
            req.vault = vault;
            return next();
        })
        .catch((error) => {
            logger.error(`POST /api/withdraw - findVault error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function findWalletVault(req, res, next) {
    return WalletVault.findOne({
        address: req.body.walletAddress,
        vault: req.body.vault
    })
        .then((walletVault) => {
            if (!walletVault || walletVault.balance < req.body.amount) {
                return res.status(400).json({
                    code: 'not_enought_balance',
                    message: 'Not enought balance'
                });
            }
            req.walletVault = walletVault;
            return next();
        })
        .catch((error) => {
            logger.error(`POST /api/withdraw - findWalletVault error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function saveMovement(req, res) {
    return WalletMovement.create({
        type: 'withdraw',
        walletAddress: req.body.walletAddress,
        vault: req.vault._id,
        amount: req.body.amount,
        status: 'pending'
    })
        .then(() => {
            return res.status(200).json({});
        })
        .catch((error) => {
            logger.error(`POST /api/withdraw - saveMovement error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Save new withdraw
* @description Save new withdraw in pending status
* @route {POST} /api/withdraw
* @queryparam {string} [walletAddress] user wallet address
* @queryparam {string} [vault] vault id where you want to make the action
* @queryparam {number} [amount] amount to withdraw
* @response {200} OK
* @response {400} Invalid fields
* @responsebody {string} [code] invalid_fields
* @responsebody {string} [message] error description
* @response {400} Invalid vault
* @responsebody {string} [code] invalid_vault
* @responsebody {string} [message] error description
* @response {400} Not enought balance
* @responsebody {string} [code] not_enought_balance
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.post('/withdraw',
    validateBodyFields(Joi.object({
        walletAddress: Joi.string().required(),
        vault: Joi.string().required(),
        amount: Joi.number().greater(0).required()
    })),
    findVault,
    findWalletVault,
    saveMovement
);

module.exports = router;
