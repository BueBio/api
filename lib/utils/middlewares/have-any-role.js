'use strict';

function haveAnyRole(roles) {
    return function(req, res, next) {
        if (!roles.includes(req.decodedToken.role)) {
            return res.status(401).json({
                code: 'unauthorized',
                message: 'Unauthorized'
            });
        }
        return next();
    };
}

module.exports = haveAnyRole;
