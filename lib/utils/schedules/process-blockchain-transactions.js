'use strict';
const logger = require('@logger');
const {BlockchainTransaction} = require('@models');
const {impactToken, futureToken, formatTokenAmount} = require('@utils/blockchain');

function getPendingTransactions() {
    return BlockchainTransaction.find({
        status: 'PENDING'
    })
        .populate([{
            path: 'references.production'
        }, {
            path: 'references.productionRewardCode'
        }, {
            path: 'references.futureProductionOffer',
            populate: {
                path: 'producer',
                model: 'Producer'
            }
        }])
        .sort('createdAt')
        .limit(5);
}

function processTransactionImpacttokenMint(transaction) {
    let blockchainTransaction;
    return impactToken().mint(
        transaction.references.production.totalQuantity
    )
        .then((response) => {
            blockchainTransaction = response;
            transaction.status = 'SENDED';
            transaction.transactionId = blockchainTransaction.hash;
            transaction.references.production.tokenId = blockchainTransaction.id;
            transaction.references.production.transactionId = blockchainTransaction.hash;
            return Promise.all([
                transaction.save(),
                transaction.references.production.save()
            ]);
        })
        .then(() => {
            return blockchainTransaction.wait();
        });
}

function processTransactionImpacttokenAssign(transaction) {
    let blockchainTransaction;
    return impactToken().transferFrom(
        transaction.references.production.tokenId,
        1,
        transaction.references.productionRewardCode.walletAddress
    )
        .then((response) => {
            blockchainTransaction = response;
            transaction.status = 'SENDED';
            transaction.transactionId = blockchainTransaction.hash;
            transaction.references.productionRewardCode.transactionId = blockchainTransaction.hash;
            return Promise.all([
                transaction.save(),
                transaction.references.productionRewardCode.save()
            ]);
        })
        .then(() => {
            return blockchainTransaction.wait();
        });
}

function processTransactionFuturetokenMint(transaction) {
    let blockchainTransaction;
    return futureToken().mint(
        transaction.references.futureProductionOffer.totalQuantity,
        parseInt(transaction.references.futureProductionOffer.availabledAt.getTime() / 1000),
        transaction.references.futureProductionOffer.priceTokenAddress,
        formatTokenAmount(
            transaction.references.futureProductionOffer.priceAmount,
            transaction.references.futureProductionOffer.priceTokenDecimals
        ),
        transaction.references.futureProductionOffer.producer.walletAddress
    )
        .then((response) => {
            blockchainTransaction = response;
            transaction.status = 'SENDED';
            transaction.transactionId = blockchainTransaction.hash;
            transaction.references.futureProductionOffer.tokenId = blockchainTransaction.id;
            transaction.references.futureProductionOffer.transactionId = blockchainTransaction.hash;
            return Promise.all([
                transaction.save(),
                transaction.references.futureProductionOffer.save()
            ]);
        })
        .then(() => {
            return blockchainTransaction.wait();
        });
}

function processTransaction(transaction) {
    switch (transaction.type) {
        case 'IMPACTTOKEN_MINT':
            return processTransactionImpacttokenMint(transaction);
        case 'IMPACTTOKEN_ASSIGN':
            return processTransactionImpacttokenAssign(transaction);
        case 'FUTURETOKEN_MINT':
            return processTransactionFuturetokenMint(transaction);
        default:
            throw new Error('invalid type');
    }
}

async function processTransactions(transactions) {
    for (const transaction of transactions) {
        await processTransaction(transaction)
            .then((response) => {
                transaction.status = 'PROCESSED';
                if (!transaction.logs) {
                    transaction.logs = [];
                }
                transaction.logs.push(JSON.stringify(response));
                return transaction.save();
            })
            .catch((error) => {
                transaction.tries++;
                if (!transaction.errorLog) {
                    transaction.errorLog = [];
                }
                transaction.errorLog.push(error.message || error);
                transaction.status = 'PENDING';
                if (transaction.tries > 5) {
                    transaction.status = 'FAILED';
                }
                return transaction.save();
            })
            .catch((error) => {
                logger.error(`[schedule] processBlockchainTransactions error: ID: ${transaction._id} - ERROR: ${error.message}`);
            });
    }
}

function processBlockchainTransactions() {
    return getPendingTransactions()
        .then((transactions) => {
            return processTransactions(transactions);
        });
}

module.exports = processBlockchainTransactions;
