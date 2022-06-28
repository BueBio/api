'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletVaultSchema = new Schema({
    address: String,
    vault: {
        type: Schema.Types.ObjectId,
        ref: 'Vault'
    },
    balance: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('WalletVault', walletVaultSchema);
