'use strict';

function addProducerConditionFromUser(req, res, next) {
    if (req.user.role === 'producer') {
        if (!req.query.conditions) {
            req.query.conditions = {};
        }
        req.query.conditions.producer = req.user.producer;
    }
    return next();
}

module.exports = addProducerConditionFromUser;
