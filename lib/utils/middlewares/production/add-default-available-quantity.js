'use strict';

function addDefaultAvailableQuantity(req, res, next) {
    req.body.availableQuantity = req.body.totalQuantity;
    return next();
}

module.exports = addDefaultAvailableQuantity;
