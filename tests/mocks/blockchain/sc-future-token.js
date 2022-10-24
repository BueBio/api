'use strict';
const {ethers} = require('ethers');

const FutureToken = function(address, abi, wallet) {
    this.address = address;
    this.abi = abi;
    this.wallet = wallet;
    this.transactions = [];

    return {
        estimateGas: {
            mint: async() => {
                return ethers.BigNumber.from(11);
            }
        },
        maxId: async() => {
            return ethers.BigNumber.from(2);
        },
        mint: async(id, amount, data, availableAt, payToken, payAmount, recipient, options) => {
            if (
                options.gasPrice.toNumber() !== 5 ||
                options.gasLimit.toNumber() !== 11
            ) {
                throw new Error('invalid_gas');
            }
            this.transactions.push({
                type: 'mint',
                data: {
                    id,
                    amount,
                    data,
                    availableAt,
                    payToken,
                    payAmount,
                    recipient,
                    options,
                    createdAt: new Date()
                }
            });
            const transactionHash = `${id}_${amount}_` +
                `${availableAt}_${payToken}_${payAmount}_${recipient}`;
            const toWait = () => {
                return new Promise((resolve, reject) => {
                    if (amount === 2001) {
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

module.exports = FutureToken;
