'use strict';
const app = require('../../mocks/app');
require('should');
const scMarketplaceBuy = require('@utils/events-listeners/sc-marketplace-buy');
const {TokenMarketplace} = require('@models');

describe('Utils - events-listeners - sc-marketplace-buy', () => {
    before(() => {
        return app.start();
    });

    beforeEach(() => {
        return Promise.all([
            TokenMarketplace.create({
                marketplaceId: 1,
                typeToken: 'impactToken',
                owner: '0000000000000000aaaaaa01',
                priceAmount: 11,
                tokenId: 25,
                urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
            }),
            TokenMarketplace.create({
                marketplaceId: 4,
                typeToken: 'futureToken',
                owner: '0000000000000000aaaaaa02',
                priceAmount: 7,
                tokenId: 10,
                urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-future/4.json'
            })
        ]);
    });

    afterEach(() => {
        return TokenMarketplace.deleteMany({});
    });

    after(() => {
        return app.finish();
    });

    it('Should remove a publication (impact token)', function() {
        return scMarketplaceBuy(
            1,
            '0000000000000000aaaaaa05',
            '0000000000000000aaaaaa05'
        )
            .then(() => {
                return TokenMarketplace.find();
            })
            .then((tokens) => {
                tokens.should.have.length(1);
                tokens.should.containDeep([{
                    marketplaceId: 4,
                    typeToken: 'futureToken',
                    owner: '0000000000000000aaaaaa02',
                    priceAmount: 7,
                    tokenId: 10,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-future/4.json'
                }]);
            });
    });

    it('Should save a new publication (future token)', function() {
        return scMarketplaceBuy(
            4,
            '0000000000000000aaaaaa06',
            '0000000000000000aaaaaa06'
        )
            .then(() => {
                return TokenMarketplace.find();
            })
            .then((tokens) => {
                tokens.should.have.length(1);
                tokens.should.containDeep([{
                    marketplaceId: 1,
                    typeToken: 'impactToken',
                    owner: '0000000000000000aaaaaa01',
                    priceAmount: 11,
                    tokenId: 25,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
                }]);
            });
    });
});
