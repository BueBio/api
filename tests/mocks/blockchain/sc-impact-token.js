'use strict';
const {ethers} = require('ethers');

const ImpactToken = function(address, abi, wallet) {
    this.address = address;
    this.abi = abi;
    this.wallet = wallet;
    this.transactions = [];

    return {
        estimateGas: {
            mint: async() => {
                return ethers.BigNumber.from(11);
            },
            safeTransferFrom: async() => {
                return ethers.BigNumber.from(15);
            }
        },
        maxId: async() => {
            return ethers.BigNumber.from(2);
        },
        mint: async(account, id, quantity, data, options) => {
            if (
                options.gasPrice.toNumber() !== 5 ||
                options.gasLimit.toNumber() !== 11
            ) {
                throw new Error('invalid_gas');
            }
            this.transactions.push({
                type: 'mint',
                data: {
                    account,
                    id,
                    quantity,
                    data,
                    options,
                    createdAt: new Date()
                }
            });
            const transactionHash = `${id}_${quantity}_${account}`;
            const toWait = () => {
                return new Promise((resolve, reject) => {
                    if (quantity === 2001) {
                        return reject(new Error('rejected_transaction'));
                    }
                    return resolve({
                        hash: transactionHash
                    });
                });
            };
            return {
                hash: transactionHash,
                wait: toWait
            };
        },
        safeTransferFrom: async(fromAddress, toAddress, id, quantity, data, options) => {
            if (
                options.gasPrice.toNumber() !== 5 ||
                options.gasLimit.toNumber() !== 15
            ) {
                throw new Error('invalid_gas');
            }
            this.transactions.push({
                type: 'safeTransferFrom',
                data: {
                    fromAddress,
                    id,
                    quantity,
                    data,
                    options,
                    createdAt: new Date()
                }
            });
            const transactionHash = `${id}_${quantity}_${fromAddress}_${toAddress}`;
            const toWait = () => {
                return new Promise((resolve, reject) => {
                    if (quantity === 2001) {
                        return reject(new Error('rejected_transaction'));
                    }
                    return resolve({
                        hash: transactionHash
                    });
                });
            };
            return {
                hash: transactionHash,
                wait: toWait
            };
        }
    };
};

module.exports = ImpactToken;
