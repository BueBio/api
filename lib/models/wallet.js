'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    address: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', walletSchema);
