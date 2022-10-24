'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const producerSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    logo: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    walletAddress: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producer', producerSchema);
