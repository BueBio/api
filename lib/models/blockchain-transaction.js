'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockchainTransactionSchema = new Schema({
    type: {
        type: String,
        enum: ['IMPACTTOKEN_MINT', 'IMPACTTOKEN_ASSIGN', 'FUTURETOKEN_MINT']
    },
    status: {
        type: String,
        enum: ['PENDING', 'SENDED', 'PROCESSED', 'FAILED'],
        default: 'PENDING'
    },
    references: {
        production: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Production'
        },
        futureProductionOffer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FutureProductionOffer'
        },
        productionRewardCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductionRewardCode'
        }
    },
    tries: {
        type: Number,
        default: 0
    },
    transactionId: String,
    errorLog: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('BlockchainTransaction', blockchainTransactionSchema);
