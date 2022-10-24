'use strict';
const logger = require('@lib/logger');
const {TokenMarketplace} = require('@lib/models');

function scMarketplaceUnpublish(id) {
    return TokenMarketplace.deleteOne({
        marketplaceId: id
    })
        .catch((error) => {
            logger.error(`[EVENTS] sc-marketplace-unpublish error - id: "${id}" - message: ${error.message}`);
        });
}

module.exports = scMarketplaceUnpublish;
