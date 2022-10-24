'use strict';
const jwt = require('jsonwebtoken');
const {User} = require('@models');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

function getJwt(req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.indexOf('Bearer') !== -1) {
        token = req.headers.authorization.replace('Bearer ', '');
    } else if (req.query && req.query.jwt) {
        token = req.query.jwt;
    }
    return token;
}

function validateUser(req, res, next) {
    return User.findById(req.decodedToken.sub)
        .then((user) => {
            req.user = user;
            return next();
        })
        .catch(() => {
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}


function extractJwt(req, res, next) {
    const options = {issuer: JWT_ISSUER};
    if (process.env.NODE_ENV === 'testing') {
        options.ignoreExpiration = true;
    }
    jwt.verify(
        getJwt(req),
        JWT_SECRET,
        options,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    code: 'unauthorized',
                    message: 'Unauthorized'
                });
            }
            req.decodedToken = decoded;
            return validateUser(req, res, next);
        }
    );
}

module.exports = extractJwt;
