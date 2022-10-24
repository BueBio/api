'use strict';
const express = require('express');
const router = express.Router();
const {FutureProductionOffer} = require('@lib/models');
const logger = require('@lib/logger');

function renderFilters(parameters, optionQuerys) {
    if (parameters.limit) {
        optionQuerys.limit = parameters.limit;
    }

    if (parameters.skip) {
        optionQuerys.skip = parameters.skip;
    }

    if (parameters.sort) {
        optionQuerys.sort = parameters.sort;
    }

    if (parameters.search) {
        optionQuerys.filters = parameters.search;
    }
}

function returnFutureProductions(req, res) {
    let promise;
    let optionQuerys = {
        limit: 20,
        skip: 0,
        sort: '-createdAt',
        filters: {}
    };
    renderFilters(req.query, optionQuerys);

    if (req.query.count) {
        promise = FutureProductionOffer.find(optionQuerys.filters).count();
    } else {
        promise = FutureProductionOffer
            .find(optionQuerys.filters)
            .sort(optionQuerys.sort)
            .skip(optionQuerys.skip)
            .limit(optionQuerys.limit)
            .populate(req.query.populate);
    }

    return promise
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            logger.error(`GET /api/future/production/offers - returnFutureProductions error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });


}

function returnFutureProductionsByID(req, res) {
    return FutureProductionOffer.findById(req.params.id)
        .populate([{
            path: 'image'
        }, {
            path: 'producer',
            populate: {
                path: 'logo',
                model: 'File'
            }
        }])
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            logger.error(`GET /api/future/production/offers/:id - returnFutureProductionsByID error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

/**
    * @name Get future production get by id
    * @description Get a future production filtering by identifier
    * @route {GET} /api/future/production/offers/:id
    * @queryparam (optional) {string} [populate] Fields to populate
    * @response {200} OK
    * @responsebody {string} [_id] Unique identifier
    * @responsebody {string} [producer] Identifier related to Producer (could be object if its populated)
    * @responsebody {string} [productName] Product name
    * @responsebody {string} [productDescription] Product short description
    * @responsebody {string} [description] Product description
    * @responsebody {date} [publishedAt] Date of publication in marketplace
    * @responsebody {date} [expiredAt] Expired date
    * @responsebody {date} [availabledAt] Available date
    * @responsebody {number} [totalQuantity] Amount of items produced in this production
    * @responsebody {number} [availableQuantity] Amount of items available to be rewarded
    * @responsebody {string} [priceTokenAddress] Price address token
    * @responsebody {string} [priceTokenSymbol] Price token symbol
    * @responsebody {number} [priceTokenDecimals] Price token decimals
    * @responsebody {string} [image] Identifier related to File (could be object if its populated)
    * @responsebody {string} [status] Status. Posible values: "pending", "active", "rejected", "finished"
    */

router.get(
    '/future/production/offers/:id',
    returnFutureProductionsByID);
/**
* @name Get future productions get
* @description Returns all future productions, with querys limit, skip, search, sort and count
* @route {GET} /api/future/production/offers
* @bodyparam {optional} {number} [skip] Documents to skip
* @bodyparam {optional} {number} [limit] Max quantity of documents to return
* @bodyparam {optional} {string} [search] To search into documents
* @bodyparam {optional} {boolean} [count] Return the count of that condition
* @bodyparam {optional} {string} [sort] Fields to sort
* @response {200} OK
* @responsebody {string} [object] Future productions object
* @response {401} Authentication error
* @responsebody {string} [code] authentication_failed
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.get(
    '/future/production/offers',
    returnFutureProductions
);

module.exports = router;
