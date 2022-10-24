'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    address: {
        type: String
    },
    symbol: {
        type: String
    },
    name: {
        type: String
    },
    decimals: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coin', coinSchema);
