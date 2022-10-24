'use strict';
const {ethers} = require('ethers');
const logger = require('@lib/logger');
const scImpactTokenAbi = require('./abi/BuebioImpact.json');
const BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS = process.env.BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS;
const BLOCKCHAIN_BUEBIO_ADDRESS = process.env.BLOCKCHAIN_BUEBIO_ADDRESS;

class ImpactToken {
    constructor(connection, wallet) {
        this.connection = connection;
        this.contract = new ethers.Contract(BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS, scImpactTokenAbi, wallet);
        logger.info(`[BLOCKCHAIN] ImpactToken initialized (address: ${BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS})`);
    }

    maxId() {
        return this.contract.maxId()
            .then((response) => {
                return response.toNumber();
            });
    }
    
    async mint(quantity) {
        const currentMaxId = await this.maxId();
        const estimate = await this.contract.estimateGas.mint(
            BLOCKCHAIN_BUEBIO_ADDRESS,
            currentMaxId + 1,
            quantity,
            '0x'
        );
        const gasPrice = await this.connection.getGasPrice();
        const response = await this.contract.mint(
            BLOCKCHAIN_BUEBIO_ADDRESS,
            currentMaxId + 1,
            quantity,
            '0x',
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
    
    async transferFrom(tokenId, quantity, addressTo) {
        const estimate = await this.contract.estimateGas.safeTransferFrom(
            BLOCKCHAIN_BUEBIO_ADDRESS,
            addressTo,
            tokenId,
            quantity,
            '0x'
        );
        const gasPrice = await this.connection.getGasPrice();
        const response = await this.contract.safeTransferFrom(
            BLOCKCHAIN_BUEBIO_ADDRESS,
            addressTo,
            tokenId,
            quantity,
            '0x',
            {
                gasPrice,
                gasLimit: estimate
            }
        );
        return {
            hash: response.hash,
            wait: response.wait
        };
    }
}

module.exports = ImpactToken;
