'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletMovementSchema = new Schema({
    type: {
        type: String,
        enum: ['deposit', 'withdraw']
    },
    walletAddress: String,
    vault: {
        type: Schema.Types.ObjectId,
        ref: 'Vault'
    },
    transactionHash: String,
    amount: Number,
    status: {
        type: String,
        enum: ['pending', 'success', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WalletMovement', walletMovementSchema);
