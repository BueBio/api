'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const events = require('@utils/events-emitter');

const productionSchema = new Schema({
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'Producer'
    },
    productName: String,
    productDescription: String,
    producedAt: Date,
    publishedAt: Date,
    batch: String,
    totalQuantity: Number,
    availableQuantity: Number,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected', 'finished'],
        default: 'pending'
    },
    transactionId: String,
    tokenId: Number
}, {
    timestamps: true
});

productionSchema.pre('save', function(next) {
    this.wasNew = this.isNew;
    this.emitProductionToActive = !this.isNew && this.isModified('status') && this.status === 'active';
    next();
});

productionSchema.post('save', function(doc) {
    if (this.emitProductionToActive) {
        events.emit('production-to-active', doc._id.toString());
        events.emit('generate-codes-production', doc._id.toString());
    }
});

module.exports = mongoose.model('Production', productionSchema);
