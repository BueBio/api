'use strict';
const app = require('../../mocks/app');
require('should');
const {BigNumber} = require('ethers');
const scMarketplacePublish = require('@utils/events-listeners/sc-marketplace-publish');
const {TokenMarketplace} = require('@models');

describe('Utils - events-listeners - sc-marketplace-publish', () => {
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
                tokenId: 1,
                urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
            })
        ]);
    });

    afterEach(() => {
        return TokenMarketplace.deleteMany({});
    });

    after(() => {
        return app.finish();
    });

    it('Should save a new publication (impact token)', function() {
        return scMarketplacePublish(
            2,
            '0000000000000000aaaaaa02',
            {
                owner: '0000000000000000aaaaaa02',
                tokenAddress: process.env.BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS,
                tokenId: 3,
                payToken: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                payAmount: BigNumber.from('5000000')
            }
        )
            .then(() => {
                return TokenMarketplace.find();
            })
            .then((tokens) => {
                tokens.should.have.length(2);
                tokens.should.containDeep([{
                    marketplaceId: 1,
                    typeToken: 'impactToken',
                    owner: '0000000000000000aaaaaa01',
                    priceAmount: 11,
                    tokenId: 1,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
                }, {
                    marketplaceId: 2,
                    typeToken: 'impactToken',
                    owner: '0000000000000000aaaaaa02',
                    priceAmount: 5,
                    tokenId: 3,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/3.json'
                }]);
            });
    });

    it('Should save a new publication (future token)', function() {
        return scMarketplacePublish(
            3,
            '0000000000000000aaaaaa02',
            {
                owner: '0000000000000000aaaaaa02',
                tokenAddress: process.env.BLOCKCHAIN_SC_FUTURETOKEN_ADDRESS,
                tokenId: 2,
                payToken: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                payAmount: BigNumber.from('7000000')
            }
        )
            .then(() => {
                return TokenMarketplace.find();
            })
            .then((tokens) => {
                tokens.should.have.length(2);
                tokens.should.containDeep([{
                    marketplaceId: 1,
                    typeToken: 'impactToken',
                    owner: '0000000000000000aaaaaa01',
                    priceAmount: 11,
                    tokenId: 1,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
                }, {
                    marketplaceId: 3,
                    typeToken: 'futureToken',
                    owner: '0000000000000000aaaaaa02',
                    priceAmount: 7,
                    tokenId: 2,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-future/2.json'
                }]);
            });
    });

    it('Should upsert a publication (impact token)', function() {
        return scMarketplacePublish(
            1,
            '0000000000000000aaaaaa02',
            {
                owner: '0000000000000000aaaaaa01',
                tokenAddress: process.env.BLOCKCHAIN_SC_IMPACTTOKEN_ADDRESS,
                tokenId: 1,
                payToken: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                payAmount: BigNumber.from('11000000')
            }
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
                    tokenId: 1,
                    urlJson: 'https://api.dev.buebio.com/public/tokens/json/buebio-impact/1.json'
                }]);
            });
    });
});
