'use strict';
const {ethers} = require('ethers');
const logger = require('@lib/logger');
const events = require('@utils/events-emitter');
const scMarketplaceAbi = require('./abi/BuebioMarketplace.json');
const BLOCKCHAIN_SC_MARKETPLACE_ADDRESS = process.env.BLOCKCHAIN_SC_MARKETPLACE_ADDRESS;

class Marketplace {
    constructor(connection, wallet) {
        this.connection = connection;
        this.contract = new ethers.Contract(BLOCKCHAIN_SC_MARKETPLACE_ADDRESS, scMarketplaceAbi, wallet);
        logger.info(`[BLOCKCHAIN] Marketplace initialized (address: ${BLOCKCHAIN_SC_MARKETPLACE_ADDRESS})`);
    }

    waitEventPublish() {
        this.contract.on('Publish', (id, owner, publication) => {
            logger.debug('----------- New event: "Publish"');
            logger.debug(`- id: ${id}`);
            logger.debug(`- owner: ${owner}`);
            logger.debug(`- publication.owner: ${publication.owner}`);
            logger.debug(`- publication.tokenAddress: ${publication.tokenAddress}`);
            logger.debug(`- publication.tokenId: ${publication.tokenId}`);
            logger.debug(`- publication.payToken: ${publication.payToken}`);
            logger.debug(`- publication.payAmount: ${publication.payAmount}`);
            events.emit('sc-marketplace-publish', {
                id,
                owner,
                publication
            });
        });
    }

    waitEventUnpublish() {
        this.contract.on('Unpublish', (id, owner) => {
            logger.debug('----------- New event: "Unpublish"');
            logger.debug(`- id: ${id}`);
            logger.debug(`- owner: ${owner}`);
            events.emit('sc-marketplace-unpublish', {
                id,
                owner
            });
        });
    }

    waitEventBuy() {
        this.contract.on('Buy', (id, sender, toWallet) => {
            logger.debug('----------- New event: "Buy"');
            logger.debug(`- id: ${id}`);
            logger.debug(`- sender: ${sender}`);
            logger.debug(`- toWallet: ${toWallet}`);
            events.emit('sc-marketplace-buy', {
                id,
                sender,
                toWallet
            });
        });
    }
}

module.exports = Marketplace;
