'use strict';

const router = require('express').Router();
const haveAnyRole = require('@middlewares/have-any-role');
const validatePendingProduction = require('@middlewares/production/validate-pending-production');
const changeStateProduction = require('@middlewares/production/change-state-production');

/**
* @name Production reject
* @description Reject a production
* @route {POST} /api/productions/:id/reject
* @queryparam {string} [id] Production ID to reject
* @response {200} OK
* @response {401} Unauthorized
* @responsebody {string} [code] unauthorized
* @responsebody {string} [message] Unauthorized
* @response {400} Production not found
* @responsebody {string} [code] production_not_found
* @responsebody {string} [message] error description
* @response {400} Production is not pending
* @responsebody {string} [code] production_is_not_pending
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.post(
    '/productions/:id/reject',
    haveAnyRole(['admin']),
    validatePendingProduction,
    changeStateProduction('rejected')
);

module.exports = router;
