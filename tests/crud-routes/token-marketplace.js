'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {
    Coin,
    TokenMarketplace
} = require('@models');

describe('SaveMarketplaceToken', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
            Coin.create({
                _id: '00000000000000aabb000001',
                address: '0000000000000000aaaaaa11',
                symbol: 'USDC',
                name: 'USD Coin',
                decimals: 18
            }),
            Coin.create({
                _id: '00000000000000aabb000002',
                address: '0000000000000000aaaaaa12',
                symbol: 'DAI',
                name: 'DAI',
                decimals: 18
            }),
            TokenMarketplace.create({
                marketplaceId: 1,
                typeToken: 'impactToken',
                owner: '0000000000000000aaaaaa01',
                coin: '00000000000000aabb000001',
                priceAmount: 11,
                tokenId: 1,
                urlJson: 'https://test-local/tokens/buebio-impact/1.json'
            }),
            TokenMarketplace.create({
                marketplaceId: 2,
                typeToken: 'impactToken',
                owner: '0000000000000000aaaaaa01',
                coin: '00000000000000aabb000002',
                priceAmount: 12,
                tokenId: 2,
                urlJson: 'https://test-local/tokens/buebio-impact/2.json'
            }),
            TokenMarketplace.create({
                marketplaceId: 3,
                typeToken: 'futureToken',
                owner: '0000000000000000aaaaaa02',
                coin: '00000000000000aabb000001',
                priceAmount: 13,
                tokenId: 1,
                urlJson: 'https://test-local/tokens/buebio-future/1.json'
            }),
            TokenMarketplace.create({
                marketplaceId: 4,
                typeToken: 'futureToken',
                owner: '0000000000000000aaaaaa02',
                coin: '00000000000000aabb000001',
                priceAmount: 14,
                tokenId: 15,
                urlJson: 'https://test-local/tokens/buebio-future/15.json'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            Coin.deleteMany({}),
            TokenMarketplace.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET - /tokenmarketplaces -', () => {
        it('Should return all data', function() {
            return request(application)
                .get('/api/tokenmarketplaces')
                .set('Accept', 'application/json')
                .query({
                    populate: 'coin'
                })
                .expect(200)
                .then((response) => {
                    response.body.should.containDeep([{
                        marketplaceId: 1,
                        typeToken: 'impactToken',
                        owner: '0000000000000000aaaaaa01',
                        coin: {
                            address: '0000000000000000aaaaaa11',
                            name: 'USD Coin',
                            symbol: 'USDC',
                            decimals: 18
                        },
                        tokenId: 1,
                        urlJson: 'https://test-local/tokens/buebio-impact/1.json'
                    }, {
                        marketplaceId: 2,
                        typeToken: 'impactToken',
                        owner: '0000000000000000aaaaaa01',
                        coin: {
                            address: '0000000000000000aaaaaa12',
                            name: 'DAI',
                            symbol: 'DAI',
                            decimals: 18
                        },
                        priceAmount: 12,
                        tokenId: 2,
                        urlJson: 'https://test-local/tokens/buebio-impact/2.json'
                    }, {
                        marketplaceId: 3,
                        typeToken: 'futureToken',
                        owner: '0000000000000000aaaaaa02',
                        coin: {
                            address: '0000000000000000aaaaaa11',
                            name: 'USD Coin',
                            symbol: 'USDC',
                            decimals: 18
                        },
                        priceAmount: 13,
                        tokenId: 1,
                        urlJson: 'https://test-local/tokens/buebio-future/1.json'
                    },{
                        marketplaceId: 4,
                        typeToken: 'futureToken',
                        owner: '0000000000000000aaaaaa02',
                        coin: {
                            address: '0000000000000000aaaaaa11',
                            name: 'USD Coin',
                            symbol: 'USDC',
                            decimals: 18
                        },
                        priceAmount: 14,
                        tokenId: 15,
                        urlJson: 'https://test-local/tokens/buebio-future/15.json'
                    }]);
                });
        });

        it('Should return only 2 with limit', function() {
            return request(application)
                .get('/api/tokenmarketplaces')
                .query({
                    limit: 2,
                    populate: 'coin'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.containDeep([{
                        marketplaceId: 1,
                        typeToken: 'impactToken',
                        owner: '0000000000000000aaaaaa01',
                        coin: {
                            address: '0000000000000000aaaaaa11',
                            name: 'USD Coin',
                            symbol: 'USDC',
                            decimals: 18
                        },
                        priceAmount: 11,
                        tokenId: 1,
                        urlJson: 'https://test-local/tokens/buebio-impact/1.json'
                    }, {
                        marketplaceId: 2,
                        typeToken: 'impactToken',
                        owner: '0000000000000000aaaaaa01',
                        coin: {
                            address: '0000000000000000aaaaaa12',
                            name: 'DAI',
                            symbol: 'DAI',
                            decimals: 18
                        },
                        priceAmount: 12,
                        tokenId: 2,
                        urlJson: 'https://test-local/tokens/buebio-impact/2.json'
                    }]);
                });
        });

        it('Should return data length with count', function() {
            return request(application)
                .get('/api/tokenmarketplaces?count=true')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.be.equal(4);
                });
        });


        it('Should return only token 2 and 3 skipping token 1', function() {
            return request(application)
                .get('/api/tokenmarketplaces')
                .query({
                    limit: 2,
                    skip: 1,
                    populate: 'coin'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.containDeep([{
                        marketplaceId: 2,
                        typeToken: 'impactToken',
                        owner: '0000000000000000aaaaaa01',
                        coin: {
                            address: '0000000000000000aaaaaa12',
                            name: 'DAI',
                            symbol: 'DAI',
                            decimals: 18
                        },
                        priceAmount: 12,
                        tokenId: 2,
                        urlJson: 'https://test-local/tokens/buebio-impact/2.json'
                    }, {
                        marketplaceId: 3,
                        typeToken: 'futureToken',
                        owner: '0000000000000000aaaaaa02',
                        coin: {
                            address: '0000000000000000aaaaaa11',
                            name: 'USD Coin',
                            symbol: 'USDC',
                            decimals: 18
                        },
                        priceAmount: 13,
                        tokenId: 1,
                        urlJson: 'https://test-local/tokens/buebio-future/1.json'
                    }]);
                });
        });
    });
});
