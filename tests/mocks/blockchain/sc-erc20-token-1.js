'use strict';

const Erc20Token = function(address, abi, provider) {
    this.address = address;
    this.abi = abi;
    this.provider = provider;
    this.data = [];

    return {
        decimals: async() => {
            return 6;
        },
        name: async() => {
            return 'USD Coin';
        },
        symbol: async() => {
            return 'USDC';
        }
    };
};

module.exports = Erc20Token;
