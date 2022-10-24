'use strict';
const {ethers} = require('ethers');

const Marketplace = function(address, abi, wallet) {
    this.address = address;
    this.abi = abi;
    this.wallet = wallet;
    this.transactions = [];

    return {
        on: (eventName, callback) => {}
    };
};

module.exports = Marketplace;
