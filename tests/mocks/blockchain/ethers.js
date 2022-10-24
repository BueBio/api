'use strict';
const {ethers} = require('ethers');
const contracts = [{
    address: process.env.BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS,
    abi: require('@utils/blockchain/abi/BuebioImpact.json'),
    mock: require('./sc-impact-token')
}, {
    address: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
    abi: require('@utils/blockchain/abi/Erc20.json'),
    mock: require('./sc-erc20-token-1')
}, {
    address: process.env.BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS,
    abi: require('@utils/blockchain/abi/BuebioFuture.json'),
    mock: require('./sc-future-token')
}, {
    address: process.env.BLOCKCHAIN_SC_MARKETPLACE_ADDRESS,
    abi: require('@utils/blockchain/abi/BuebioMarketplace.json'),
    mock: require('./sc-marketplace')
}];

const Wallet = function(privateKey, connection) {
    this.privateKey = privateKey;
    this.connection = connection;
};

class Contract {
    constructor(address, abi, wallet) {
        const scMock = contracts.find((contract) => {
            return contract.address === address &&
                  contract.abi === abi;
        });
        if (!scMock) {
            throw new Error('invalid contract parameters (address or abi)');
        }
        return new scMock.mock(address, abi, wallet);
    }
}

const JsonRpcProvider = function(rpcUrl) {
    this.rpcUrl = rpcUrl;

    this.getBlockNumber = async() => {
        return 20;
    };

    this.getGasPrice = async() => {
        return ethers.BigNumber.from(5);
    };

    this.getTransactionReceipt = async() => {
        return {fake: 1};
    };

    this.getBalance = async() => {
        return ethers.BigNumber.from(1 * (10 ** 18));
    };
};

const ethersMock = {
    providers: {
        JsonRpcProvider
    },
    Wallet,
    Contract,
    utils: ethers.utils,
    BigNumber: ethers.BigNumber
};

module.exports = {
    ethers: ethersMock,
    BigNumber: ethers.BigNumber
};
