'use strict';
const logger = require('@lib/logger');
const {BlockchainTransaction, Production} = require('@lib/models');

function saveTransaction(production) {
    return BlockchainTransaction.create({
        type: 'IMPACTTOKEN_MINT',
        status: 'PENDING',
        references: {
            production: production._id
        }
    });
}

function productionToActive(id) {
    return Production.findById(id)
        .then((production) => {
            if (!production) {
                throw new Error('Cant found Production');
            }
            return saveTransaction(production);
        })
        .catch((error) => {
            logger.error(`[EVENTS] production-to-active error - id: "${id}" - message: ${error.message}`);
        });
}

module.exports = productionToActive;
