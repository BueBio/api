'use strict';
const logger = require('@lib/logger');
const {BlockchainTransaction, FutureProductionOffer} = require('@lib/models');

function saveTransaction(production) {
    return BlockchainTransaction.create({
        type: 'FUTURETOKEN_MINT',
        status: 'PENDING',
        references: {
            futureProductionOffer: production._id
        }
    });
}

function futureproductionofferToActive(id) {
    return FutureProductionOffer.findById(id)
        .then((production) => {
            if (!production) {
                throw new Error('Cant found Production');
            }
            return saveTransaction(production);
        })
        .catch((error) => {
            logger.error(`[EVENTS] futureproductionoffer-to-active error - id: "${id}" - message: ${error.message}`);
        });
}

module.exports = futureproductionofferToActive;
