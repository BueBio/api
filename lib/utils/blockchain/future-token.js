'use strict';
const {ethers} = require('ethers');
const logger = require('@lib/logger');
const scFutureTokenAbi = require('./abi/BuebioFuture.json');
const BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS = process.env.BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS;

class FutureToken {
    constructor(connection, wallet) {
        this.connection = connection;
        this.contract = new ethers.Contract(BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS, scFutureTokenAbi, wallet);
        logger.info(`[BLOCKCHAIN] FutureToken initialized (address: ${BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS})`);
    }

    maxId() {
        return this.contract.maxId()
            .then((response) => {
                return response.toNumber();
            });
    }
    
    async mint(quantity, availableAt, payToken, payAmount, recipient) {
        const currentMaxId = await this.maxId();
        const estimate = await this.contract.estimateGas.mint(
            currentMaxId + 1,
            quantity,
            '0x',
            availableAt,
            payToken,
            payAmount,
            recipient
        );
        const gasPrice = await this.connection.getGasPrice();
        const response = await this.contract.mint(
            currentMaxId + 1,
            quantity,
            '0x',
            availableAt,
            payToken,
            payAmount,
            recipient,
            {
                gasPrice,
                gasLimit: estimate
            }
        );
        return {
            hash: response.hash,
            wait: response.wait,
            id: currentMaxId + 1
        };
    }
}

module.exports = FutureToken;
