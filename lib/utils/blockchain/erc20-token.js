'use strict';
const {ethers} = require('ethers');
const scErc20TokenAbi = require('./abi/Erc20.json');

class Erc20Token {
    constructor(provider, contractAddress) {
        this.contract = new ethers.Contract(contractAddress, scErc20TokenAbi, provider);
    }

    decimals() {
        return this.contract.decimals();
    }
    
    symbol() {
        return this.contract.symbol();
    }
    
    name() {
        return this.contract.name();
    }
}

module.exports = Erc20Token;
