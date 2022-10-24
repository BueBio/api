'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenMarketplace = new Schema({
    marketplaceId: {
        type: Number,
        unique: true
    },
    typeToken: {
        type: String,
        enum: ['impactToken', 'futureToken']
    },
    owner: String,
    coin: {
        type: Schema.Types.ObjectId,
        ref: 'Coin'
    },
    priceAmount: Number,
    tokenId: Number,
    urlJson: String
}, {
    timestamps: true
});

module.exports = mongoose.model('TokenMarketplace', tokenMarketplace);
