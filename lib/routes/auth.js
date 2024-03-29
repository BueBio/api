'use strict';
const express = require('express');
const router = express.Router();
const {User} = require('@lib/models');
const logger = require('@lib/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

function validation(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Missing params',
            code: 'missing_params'
        });
    }
    return next();
}

/**
* @name Login
* @description Generate a token from email/password
* @route {POST} /api/auth/login
* @bodyparam {string} [email] User email
* @bodyparam {string} [password] User password
* @response {200} OK
* @responsebody {string} [token] JWT Token
* @response {400} Authentication error
* @responsebody {string} [code] authentication_failed
* @responsebody {string} [message] error description
* @response {500} Internal error
* @responsebody {string} [code] internal_error
* @responsebody {string} [message] error description
*/
router.post('/auth/login', validation, (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    User.findOne({email: req.body.email})
        .then((user) => {
            if (!user || !user.validPassword(req.body.password)) {
                return res.status(400).json({
                    message: 'Authentication failed',
                    code: 'authentication_failed'
                });
            }
            const token = jwt.sign(
                user.toToken(),
                JWT_SECRET,
                {
                    expiresIn: '1d',
                    issuer: JWT_ISSUER
                }
            );
            return res.status(200).json({token});
        })
        .catch((error) => {
            logger.error(`findUserError: ${error.message}`);
            return res.status(500).json({
                message: 'Internal error',
                code: 'internal_error'
            });
        });
});

module.exports = router;
