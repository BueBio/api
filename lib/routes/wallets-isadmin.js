'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Wallet} = require('@models');

function findWallet(req, res) {
    return Wallet.findOne({
        address: req.params.address,
        role: 'admin'
    })
        .then((wallet) => {
            let isAdmin = true;
            if (!wallet) {
                isAdmin = false;
            }
            return res.status(200).json({isAdmin});
        })
        .catch((error) => {
            logger.error(`GET /api/wallets/:adddress/isadmin - findWallet error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Verify if wallet is admin
* @description Returns true if a wallet address is identified as admin
* @route {GET} /api/wallets/:address/isadmin
* @urlparam {string} [address] wallet address
* @response {200} OK
* @responsebody {boolean} [isAdmin] indicates if its admin or not
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.get('/wallets/:address/isadmin',
    findWallet
);

module.exports = router;
