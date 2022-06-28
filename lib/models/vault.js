'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vaultSchema = new Schema({
    name: String,
    description: String,
    scoring: Number,
    apy: Number,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    walletAddress: String,
    coinAddress: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Vault', vaultSchema);
