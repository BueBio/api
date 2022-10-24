'use strict';
const haveAnyRole = require('@utils/middlewares/have-any-role');
const addProducerConditionFromUser = require('@utils/middlewares/production/add-producer-condition-from-user');
const addDefaultAvailableQuantity = require('@utils/middlewares/production/add-default-available-quantity');
const validateImage = require('@utils/middlewares/production/validate-image');
const addProducerIdInBody = require('@utils/middlewares/add-producer-id-in-body');
const validateBodyFields = require('@utils/middlewares/validate-body-fields');
const Joi = require('joi');

function decorator(controller) {
    controller.request('put delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    /**
    * @name Get productions
    * @description Get all productions
    * @route {GET} /api/productions
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
    * @responsebody {date} [[].producedAt] Production date
    * @responsebody {date} [[].publishedAt] Date of publication in marketplace
    * @responsebody {string} [[].batch] Production batch identifier
    * @responsebody {number} [[].totalQuantity] Amount of items produced in this production
    * @responsebody {number} [[].availableQuantity] Amount of items available to be rewarded
    * @responsebody {string} [[].image] Identifier related to File (could be object if its populated)
    * @responsebody {string} [[].status] Status. Posible values: "pending", "active", "rejected", "finished"
    * @response {401} Unauthorized
    * @responsebody {string} [code] unauthorized
    * @responsebody {string} [message] error description
    */
    /**
    * @name Get production by id
    * @description Get a production filtering by identifier
    * @route {GET} /api/productions/:id
    * @headerparam {string} [Authorization] Token with admin or provider role
    * @queryparam (optional) {string} [populate] Fields to populate
    * @response {200} OK
    * @responsebody {string} [_id] Unique identifier
    * @responsebody {string} [producer] Identifier related to Producer (could be object if its populated)
    * @responsebody {string} [productName] Product name
    * @responsebody {string} [productDescription] Product short description
    * @responsebody {date} [producedAt] Production date
    * @responsebody {date} [publishedAt] Date of publication in marketplace
    * @responsebody {string} [batch] Production batch identifier
    * @responsebody {number} [totalQuantity] Amount of items produced in this production
    * @responsebody {number} [availableQuantity] Amount of items available to be rewarded
    * @responsebody {string} [image] Identifier related to File (could be object if its populated)
    * @responsebody {string} [status] Status. Posible values: "pending", "active", "rejected", "finished"
    * @response {401} Unauthorized
    * @responsebody {string} [code] unauthorized
    * @responsebody {string} [message] error description
    */
    controller.request('get', haveAnyRole(['admin', 'producer']));
    controller.request('get', addProducerConditionFromUser);

    /**
    * @name New production
    * @description Save new production
    * @route {POST} /api/productions
    * @headerparam {string} [Authorization] Token with provider role
    * @bodyparam {string} [productName] Product generic name
    * @bodyparam {string} (optional) [productDescription] Product short description
    * @bodyparam {date} [producedAt] Production date
    * @bodyparam {string} [batch] Batch identifier
    * @bodyparam {number} [totalQuantity] Total products quantity in production
    * @bodyparam {file} [image] IN ATTACHED - image file
    * @response {200} OK
    * @responsebody {string} [_id] Unique identifier
    * @responsebody {string} [producer] Identifier related to Producer
    * @responsebody {string} [productName] Product name
    * @responsebody {string} [productDescription] Product short description
    * @responsebody {date} [producedAt] Production date
    * @responsebody {string} [batch] Production batch identifier
    * @responsebody {number} [totalQuantity] Amount of items produced in this production
    * @responsebody {number} [availableQuantity] Amount of items available to be rewarded
    * @responsebody (optional) {string} [image] Identifier related to File
    * @responsebody {string} [status] Status. Posible values: "pending", "active", "rejected", "finished"
    * @response {401} Unauthorized
    * @responsebody {string} [code] unauthorized
    * @responsebody {string} [message] error description
    * @response {400} Invalid fields
    * @responsebody {string} [code] invalid_fields
    * @responsebody {string} [message] error description
    */
    controller.request('post', haveAnyRole(['producer']));
    controller.request('post', validateBodyFields(Joi.object({
        productName: Joi.string().min(3).max(50).required(),
        productDescription: Joi.string().min(3).max(50),
        producedAt: Joi.date().less('now').required(),
        batch: Joi.string().min(3).max(50).required(),
        totalQuantity: Joi.number().integer().greater(1).required(),
        image: Joi.string().hex().length(24)
    })));
    controller.request('post', validateImage);
    controller.request('post', addProducerIdInBody);
    controller.request('post', addDefaultAvailableQuantity);
}

module.exports = decorator;
