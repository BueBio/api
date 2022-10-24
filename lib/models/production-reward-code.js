'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productionRewardCodeSchema = new Schema({
    production: {
        type: Schema.Types.ObjectId,
        ref: 'Production'
    },
    code: {
        type: String
    },
    status: {
        type: String,
        enum: ['available', 'used', 'cancelled'],
        required: true
    },
    walletAddress: String,
    transactionId: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductionRewardCode', productionRewardCodeSchema);
