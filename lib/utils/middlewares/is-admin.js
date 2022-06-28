'use strict';
const Joi = require('joi');
const {Wallet} = require('@models');
const logger = require('@logger');
const verifySignature = require('@utils/verify-signature');
const SECONDS = parseInt(process.env.AUTH_SIGNATURE_MAXSECONDS);

function isAdmin(req, res, next) {
    const currentTimestamp = new Date().getTime();
    const minTimestamp = currentTimestamp - (SECONDS * 1000);
    const {error: validationError} = Joi.object({
        authTimestamp: Joi.number().required().min(minTimestamp).max(currentTimestamp),
        authSignature: Joi.string().required()
    }).unknown().validate(req.query);
    if (validationError) {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    }

    const address = verifySignature(req.query.authSignature, req.query.authTimestamp);
    
    return Wallet.findOne({
        address,
        role: 'admin'
    })
        .then((wallet) => {
            if (!wallet) {
                return res.status(401).json({
                    code: 'unauthorized',
                    message: 'Unauthorized'
                });
            }
            req.validatedWallet = wallet;
            return next();
        })
        .catch((error) => {
            logger.error(`[middleware] is-admin error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });

}

module.exports = isAdmin;
