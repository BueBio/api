'use strict';
const logger = require('@lib/logger');
const {TokenMarketplace} = require('@lib/models');

function scMarketplaceBuy(id) {
    return TokenMarketplace.deleteOne({
        marketplaceId: id
    })
        .catch((error) => {
            logger.error(`[EVENTS] sc-marketplace-buy error - id: "${id}" - message: ${error.message}`);
        });
}

module.exports = scMarketplaceBuy;
