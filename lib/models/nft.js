'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    name: String,
    vault: {
        type: Schema.Types.ObjectId,
        ref: 'Vault'
    },
    address: String,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NFT', nftSchema);
