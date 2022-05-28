'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    originalname: String,
    filename: String,
    mimetype: String,
    size: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
