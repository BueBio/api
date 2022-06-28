'use strict';
const ethers = require('ethers');

function verifySignature(signature, message) {
    const address = ethers.utils.verifyMessage(
        message,
        signature
    );
    return address;
}

module.exports = verifySignature;
