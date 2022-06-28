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
            logger.error(`POST /api/deposit - findVault error: ${error.message}`);
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
            if (!walletVault) {
                req.walletVault = new WalletVault({
                    address: req.body.walletAddress,
                    vault: req.body.vault,
                    balance: 0
                });
            } else {
                req.walletVault = walletVault;
            }
            return next();
        })
        .catch((error) => {
            logger.error(`POST /api/deposit - findWalletVault error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function saveMovement(req, res) {
    return WalletMovement.create({
        type: 'deposit',
        walletAddress: req.body.walletAddress,
        vault: req.vault._id,
        transactionHash: req.body.transactionHash,
        amount: req.body.amount,
        status: 'success'
    })
        .then(() => {
            req.walletVault.balance += parseInt(req.body.amount, 10); // TODO: esto se va a hacer una vez confirmado el depósito
            return req.walletVault.save();
        })
        .then(() => {
            return res.status(200).json({});
        })
        .catch((error) => {
            logger.error(`POST /api/deposit - saveMovement error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Save new deposit
* @description Save new deposit
* @route {POST} /api/deposit
* @queryparam {string} [walletAddress] user wallet address
* @queryparam {string} [vault] vault id where you want to make the action
* @queryparam {string} [transactionHash] tokens transaction hash
* @queryparam {number} [amount] amount sended
* @response {200} OK
* @response {400} Invalid fields
* @responsebody {string} [code] invalid_fields
* @responsebody {string} [message] error description
* @response {400} Invalid vault
* @responsebody {string} [code] invalid_vault
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.post('/deposit',
    validateBodyFields(Joi.object({
        walletAddress: Joi.string().required(),
        vault: Joi.string().required(),
        transactionHash: Joi.string().required(),
        amount: Joi.number().greater(0).required()
    })),
    findVault,
    findWalletVault,
    saveMovement
);

module.exports = router;
