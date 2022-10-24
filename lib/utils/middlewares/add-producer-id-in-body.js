'use strict';

function addProducerIdInBody(req, res, next) {
    req.body.producer = req.user.producer;
    return next();
}

module.exports = addProducerIdInBody;
