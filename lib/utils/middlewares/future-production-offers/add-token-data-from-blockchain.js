'use strict';
const logger = require('@logger');
const {erc20Token} = require('@utils/blockchain');

function addTokenDataFromBlockchain(req, res, next) {
    const token = erc20Token(req.body.priceTokenAddress);
    return Promise.all([
        token.decimals(),
        token.symbol(),
        token.name()
    ])
        .then((responses) => {
            req.body.priceTokenDecimals = responses[0];
            req.body.priceTokenSymbol = responses[1];
            req.body.priceTokenName = responses[2];
            return next();
        })
        .catch((err) => {
            logger.error(`POST /futureproductionoffers - addTokenDataFromBlockchain error: ${err.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

module.exports = addTokenDataFromBlockchain;
