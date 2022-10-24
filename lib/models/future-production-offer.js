'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const events = require('@utils/events-emitter');

const futureProductionOfferSchema = new Schema({
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'Producer'
    },
    productName: String,
    productDescription: String,
    description: String,
    publishedAt: Date,
    expiredAt: Date,
    availabledAt: Date,
    totalQuantity: Number,
    availableQuantity: Number,
    priceTokenAddress: String,
    priceTokenName: String,
    priceTokenSymbol: String,
    priceTokenDecimals: Number,
    priceAmount: Number,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected', 'finished'],
        required: true,
        default: 'pending'
    },
    transactionId: String,
    tokenId: Number
}, {
    timestamps: true
});

futureProductionOfferSchema.pre('save', function(next) {
    this.wasNew = this.isNew;
    this.emitProductionToActive = !this.isNew && this.isModified('status') && this.status === 'active';
    next();
});

futureProductionOfferSchema.post('save', function(doc) {
    if (this.emitProductionToActive) {
        events.emit('futureproductionoffer-to-active', doc._id.toString());
    }
});

module.exports = mongoose.model('FutureProductionOffer', futureProductionOfferSchema);
