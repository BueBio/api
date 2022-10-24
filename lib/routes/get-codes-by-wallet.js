'use strict';
const router = require('express').Router();
const logger = require('@logger');
const {ProductionRewardCode, Production} = require('@models');

function getRewardCodeProductionsAndTransactionids(req, res, next) {
    return ProductionRewardCode.aggregate([{
        $match: {
            walletAddress: req.params.wallet
        }
    }, {
        $group: {
            _id: '$production',
            transactionIds: {
                $push: '$transactionId'
            }
        }
    }])
        .then((rewardCodes) => {
            req.rewardCodes = rewardCodes;
            return next();
        })
        .catch((error) => {
            logger.error(`GET /api/codes/:wallet - getRewardCodeProductionsAndTransactionids error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

function getProductionDataAndResponse(req, res) {
    if (!req.rewardCodes || req.rewardCodes.length === 0) {
        return res.status(200).json([]);
    }
    const productionIds = req.rewardCodes.map((elem) => {
        return elem._id.toString();
    });
    return Production.find({_id: {$in: productionIds}})
        .populate('image')
        .then((productions) => {
            const response = productions.map((elem) => elem.toJSON());
            response.forEach((production, idx) => {
                response[idx].transactionIds = req.rewardCodes.find((rewardCode) => {
                    return rewardCode._id.toString() === production._id.toString();
                }).transactionIds;
            });
            return res.status(200).json(response);
        })
        .catch((error) => {
            logger.error(`GET /api/codes/:wallet - getProductionDataAndResponse error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
* @name Get productions of the codes claimed from a wallet
* @description Returns all the productions of the codes claimed by a wallet
* @route {GET} /api/codes/wallet/:wallet
* @bodyparam {string} [wallet] Wallet address
* @response {200} OK
* @responsebody {array<object>} [*] Array of results
* @responsebody {string} [[]._id] Unique identifier
* @responsebody {string} [[].producer] Identifier related to Producer (could be object if its populated)
* @responsebody {string} [[].productName] Product name
* @responsebody {string} [[].productDescription] Product short description
* @responsebody {date} [[].producedAt] Production date
* @responsebody {date} [[].publishedAt] Date of publication in marketplace
* @responsebody {string} [[].batch] Production batch identifier
* @responsebody {number} [[].totalQuantity] Amount of items produced in this production
* @responsebody {number} [[].availableQuantity] Amount of items available to be rewarded
* @responsebody {string} [[].image] Identifier related to File (could be object if its populated)
* @responsebody {string} [[].status] Status. Posible values: "pending", "active", "rejected", "finished"
* @responsebody {array<string>} [[].transactionIds] Blockchain transaction ids used to claim this production
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.get(
    '/codes/wallet/:wallet',
    getRewardCodeProductionsAndTransactionids,
    getProductionDataAndResponse
);

module.exports = router;
