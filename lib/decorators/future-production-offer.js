'use strict';
const Joi = require('joi');
const haveAnyRole = require('@middlewares/have-any-role');
const validateBodyFields = require('@middlewares/validate-body-fields');
const addProducerIdInBody = require('@utils/middlewares/add-producer-id-in-body');
const validateImage = require('@middlewares/production/validate-image');
const addProducerConditionFromUser = require('@middlewares/production/add-producer-condition-from-user');
const addTokenDataFromBlockchain = require('@middlewares/future-production-offers/add-token-data-from-blockchain');

function decorator(controller) {
    controller.request('put delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    /**
    * @name Get future productions
    * @description Get all future productions
    * @route {GET} /api/futureproductionoffers
    * @headerparam {string} [Authorization] Token with admin or provider role
    * @queryparam (optional) {string} [populate] Fields to populate
    * @queryparam (optional) {object} [conditions] Conditions to filter
    * @queryparam (optional) {number} [skip] Documents to skip
    * @queryparam (optional) {number} [limit] Max quantity of documents to return
    * @queryparam (optional) {string} [sort] Fields to sort
    * @response {200} OK
    * @responsebody {array<object>} [*] Array of results
    * @responsebody {string} [[]._id] Unique identifier
    * @responsebody {string} [[].producer] Identifier related to Producer (could be object if its populated)
    * @responsebody {string} [[].productName] Product name
    * @responsebody {string} [[].productDescription] Product short description
    * @responsebody {string} [[].description] Product description
    * @responsebody {date} [[].publishedAt] Date of publication in marketplace
    * @responsebody {date} [[].expiredAt] Expired date
    * @responsebody {date} [[].availabledAt] Available date
    * @responsebody {number} [[].totalQuantity] Amount of items produced in this production
    * @responsebody {number} [[].availableQuantity] Amount of items available to be rewarded
    * @responsebody {string} [[].priceTokenAddress] Price address token
    * @responsebody {string} [[].priceTokenSymbol] Price token symbol
    * @responsebody {number} [[].priceTokenDecimals] Price token decimals
    * @responsebody {string} [[].image] Identifier related to File (could be object if its populated)
    * @responsebody {string} [[].status] Status. Posible values: "pending", "active", "rejected", "finished"
    * @response {401} Unauthorized
    * @responsebody {string} [code] unauthorized
    * @responsebody {string} [message] error description
    */
    /**
    * @name Get future production by id
    * @description Get a future production filtering by identifier
    * @route {GET} /api/productions/:id
    * @headerparam {string} [Authorization] Token with admin or provider role
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
    * @response {401} Unauthorized
    * @responsebody {string} [code] unauthorized
    * @responsebody {string} [message] error description
    */
    controller.request('get', haveAnyRole(['admin', 'producer']));
    controller.request('get', addProducerConditionFromUser);

    controller.request('post', haveAnyRole(['producer']));
    controller.request('post', validateBodyFields(Joi.object({
        productName: Joi.string().min(3).max(50).required(),
        productDescription: Joi.string().min(3).max(50),
        description: Joi.string().min(25).max(500),
        expiredAt: Joi.date().greater('now').required(),
        availabledAt: Joi.date().greater('now').required(),
        totalQuantity: Joi.number().integer().greater(1).required(),
        priceAmount: Joi.number().greater(1).required(),
        priceTokenAddress: Joi.string().length(42).required(),
        image: Joi.string().hex().length(24)
    })));
    controller.request('post', validateImage);
    controller.request('post', addProducerIdInBody);
    controller.request('post', addTokenDataFromBlockchain);
}

module.exports = decorator;
