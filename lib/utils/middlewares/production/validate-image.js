'use strict';
const logger = require('@logger');
const {File} = require('@models');

function validateImage(req, res, next) {
    if (!req.body.image) {
        return next();
    }
    return File.findById(req.body.image)
        .then((imageFile) => {
            if (!imageFile) {
                return res.status(400).json({
                    code: 'invalid_image_id',
                    message: 'Invalid image id'
                });
            }
            return next();
        })
        .catch((error) => {
            logger.error(`POST /productions - validateImage error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

module.exports = validateImage;
