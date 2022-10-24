'use strict';
const logger = require('@lib/logger');
const events = require('@utils/events-emitter');
const futureproductionofferToActive = require('./futureproductionoffer-to-active');
const generateCodesProduction = require('./generate-codes-production');
const productionToActive = require('./production-to-active');
const scMarketplaceBuy = require('./sc-marketplace-buy');
const scMarketplacePublish = require('./sc-marketplace-publish');
const scMarketplaceUnpublish = require('./sc-marketplace-unpublish');
const transactionSended = require('./transaction-sended');

const eventsMap = {
    'futureproductionoffer-to-active': futureproductionofferToActive,
    'generate-codes-production': generateCodesProduction,
    'production-to-active': productionToActive,
    'sc-marketplace-buy': scMarketplaceBuy,
    'sc-marketplace-publish': scMarketplacePublish,
    'sc-marketplace-unpublish': scMarketplaceUnpublish,
    'transaction-sended': transactionSended
};

Object.keys(eventsMap).forEach((key) => {
    events.on(key, (data) => {
        logger.debug(`Event received: "${key}" - data: ${JSON.stringify(data)}`);
        eventsMap[key](data);
    });
});
