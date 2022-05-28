'use strict';

function validateBodyFields(validationSchema) {
    return (req, res, next) => {
        const {error} = validationSchema.validate(req.body);
        if (error) {
            const firstError = error.details[0].message;
            return res.status(400).json({
                code: 'invalid_fields',
                message: `Invalid fields - ${firstError}`
            });
        }
        return next();
    };
}

function populateItem(text) {
    const parts = text.split('.');
    const result = {
        path: parts[0]
    };
    if (parts.length > 1) {
        result.populate = populateItem(text.substring(parts[0].length + 1));
    }
    return result;
}

function parsePopulate(req, res, next) {
    if (req.query && req.query.populate) {
        const populates = [];
        req.query.populate.split(' ').forEach((elem) => {
            populates.push(populateItem(elem));
        });
        req.query.populate = populates;
    }
    return next();
}

module.exports = {
    validateBodyFields,
    parsePopulate
};
