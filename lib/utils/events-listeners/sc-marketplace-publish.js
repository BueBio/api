'use strict';
const logger = require('@lib/logger');
const {urlJsonOfToken, erc20Token} = require('@utils/blockchain');
const {TokenMarketplace} = require('@lib/models');
const IMPACTTOKEN_ADDRESS = process.env.BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS;
const FUTURETOKEN_ADDRESS = process.env.BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS;

function saveToken(typeToken, publication, payTokenInfo) {
    const amount = publication.payAmount.toNumber() / (10 ** payTokenInfo.decimals);
    return TokenMarketplace.updateOne({
        marketplaceId: publication.id
    }, {
        $set: {
            marketplaceId: publication.id,
            typeToken,
            owner: publication.owner,
            priceTokenAddress: publication.payToken,
            priceTokenName: payTokenInfo.name,
            priceTokenSymbol: payTokenInfo.symbol,
            priceTokenDecimals: payTokenInfo.decimals,
            priceAmount: amount,
            tokenId: publication.tokenId,
            urlJson: urlJsonOfToken(typeToken, publication.tokenId)
        }
    }, {
        upsert: true
    })
        .catch((error) => {
            logger.error(`[EVENTS] sc-marketplace-publish error - id: "${publication.id}" - message: ${error.message}`);
        });
}

function getTokenInfo(tokenAddress) {
    const token = erc20Token(tokenAddress);
    return Promise.all([
        token.decimals(),
        token.symbol(),
        token.name()
    ])
        .then((responses) => {
            return {
                decimals: responses[0],
                symbol: responses[1],
                name: responses[2]
            };
        });
}

function scMarketplacePublish(id, owner, publication) {
    let typeToken;
    switch (publication.tokenAddress) {
        case IMPACTTOKEN_ADDRESS:
            typeToken = 'impactToken';
            break;
        case FUTURETOKEN_ADDRESS:
            typeToken = 'futureToken';
            break;
        default:
            break;
    }
    if (!typeToken) {
        logger.error(`[EVENTS] sc-marketplace-publish error - id: "${id}" - message: UNKNOWN_TOKEN_ADDRESS`);
        return null;
    }
    return getTokenInfo(publication.payToken)
        .then((tokenInfo) => {
            publication.id = id;
            return saveToken(typeToken, publication, tokenInfo);
        })
        .catch((error) => {
            logger.error(`[EVENTS] sc-marketplace-publish error - id: "${id}" - message: ${error.message}`);
        });
}

module.exports = scMarketplacePublish;
