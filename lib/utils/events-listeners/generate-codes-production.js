'use strict';

const {Production, ProductionRewardCode} = require('@models');
const logger = require('@logger');

function generateCodes(quantity) {
    const codes = [];

    for (let index = 1; index <= quantity; index++) {
        const number = new Date().getTime() + index;
        const code = number.toString(36).toUpperCase();
        codes.push(code);
    }

    return codes;
}

function generateCodesProduction(productionId) {
    return Production.findById(productionId)
        .then((production) => {
            if (!production) {
                throw new Error('PRODUCTION_NOT_FOUND');
            }
            const codes = generateCodes(production.totalQuantity);
            const productionRewardCodes = codes.map((code) => ({
                production: productionId,
                code,
                status: 'available'
            }));
            return ProductionRewardCode.insertMany(productionRewardCodes);
        })
        .catch((err) => {
            logger.error(`GENERATE-CODES-PRODUCTION - ERROR - ${err.message}`);
        });
}

module.exports = generateCodesProduction;
