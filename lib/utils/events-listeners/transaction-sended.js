'use strict';
const logger = require('@lib/logger');
const {waitForTransaction} = require('@utils/blockchain');
const {Transaction} = require('@lib/models');

function waitTransactionChanges(id, transactionHash) {
    let newStatus;
    return waitForTransaction(transactionHash)
        .then(({success}) => {
            newStatus = 'PROCESSED';
            if (!success) {
                newStatus = 'FAILED';
            }
            return Transaction.findById(id);
        })
        .then((transaction) => {
            transaction.status = newStatus;
            return transaction.save();
        })
        .catch((error) => {
            logger.error(`[EVENTS] transaction-sended listenTransaction error - id: "${id}" - message: ${error.message}`);
        });
}

function transactionSended(id) {
    return Transaction.findById(id)
        .then((transaction) => {
            if (!transaction) {
                throw new Error('Invalid transaction id');
            }
            return waitTransactionChanges(transaction._id, transaction.transactionId);
        })
        .catch((error) => {
            logger.error(`[EVENTS] transaction-sended error: ${error.message}`);
        });
}

module.exports = transactionSended;
