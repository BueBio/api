'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    originalname: {
        type: String
    },
    filename: {
        type: String
    },
    mimetype: {
        type: String
    },
    size: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
