'use strict';

const router = require('express').Router();
const haveAnyRole = require('@utils/middlewares/have-any-role');
const validatePendingFutureProduction = require('@utils/middlewares/future-production-offers/validate-pending-future-production');
const changeStateProduction = require('@utils/middlewares/future-production-offers/change-state-future-production');

router.post(
    '/futureproductionoffers/:id/reject',
    haveAnyRole(['admin']),
    validatePendingFutureProduction,
    changeStateProduction('rejected')
);

module.exports = router;
