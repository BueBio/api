'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {NFT, Vault, File} = require('@models');

describe('Nfts', function() {
    let application;
    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });
    
    before(() => {
        return Promise.all([
            File.create({
                _id: '619d27eaf5d82e9e48000001',
                filename: 'nftimg1.png',
                originalname: 'nftimg1.png',
                mimetype: 'image/png',
                size: 1111
            }),
            File.create({
                _id: '619d27eaf5d82e9e48000002',
                filename: 'nftimg2.png',
                originalname: 'nftimg2.png',
                mimetype: 'image/png',
                size: 1112
            }),
            File.create({
                _id: '619d27eaf5d82e9e48000003',
                filename: 'vaultimg1.png',
                originalname: 'vaultimg1.png',
                mimetype: 'image/png',
                size: 1113
            }),
            Vault.create({
                _id: '619d27eaf5d82e9e48000011',
                name: 'Vault test 1',
                description: 'One vault',
                scoring: 1,
                apy: 11.1,
                image: '619d27eaf5d82e9e48000003',
                walletAddress: 'addressvault1'
            }),
            NFT.create({
                _id: '619d27eaf5d82e9e48000021',
                name: 'NFT test 1',
                address: 'addressnft1',
                vault: '619d27eaf5d82e9e48000011',
                image: '619d27eaf5d82e9e48000001'
            }),
            NFT.create({
                _id: '619d27eaf5d82e9e48000022',
                name: 'NFT test 2',
                address: 'addressnft2',
                image: '619d27eaf5d82e9e48000002'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            File.deleteMany({}),
            Vault.deleteMany({}),
            NFT.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET /nfts', () => {
        it('should return all nfts', function() {
            return request(application)
                .get('/api/nfts')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000021',
                        name: 'NFT test 1',
                        address: 'addressnft1',
                        vault: '619d27eaf5d82e9e48000011',
                        image: '619d27eaf5d82e9e48000001'
                    }, {
                        _id: '619d27eaf5d82e9e48000022',
                        name: 'NFT test 2',
                        address: 'addressnft2',
                        image: '619d27eaf5d82e9e48000002'
                    }]);
                });
        });

        it('should return nfts with vaults and images', function() {
            return request(application)
                .get('/api/nfts')
                .query({
                    populate: 'image vault.image'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000021',
                        name: 'NFT test 1',
                        address: 'addressnft1',
                        vault: {
                            _id: '619d27eaf5d82e9e48000011',
                            name: 'Vault test 1',
                            description: 'One vault',
                            scoring: 1,
                            apy: 11.1,
                            image: {
                                _id: '619d27eaf5d82e9e48000003',
                                filename: 'vaultimg1.png',
                                originalname: 'vaultimg1.png',
                                mimetype: 'image/png',
                                size: 1113
                            },
                            walletAddress: 'addressvault1'
                        },
                        image: {
                            _id: '619d27eaf5d82e9e48000001',
                            filename: 'nftimg1.png',
                            originalname: 'nftimg1.png',
                            mimetype: 'image/png',
                            size: 1111
                        }
                    }, {
                        _id: '619d27eaf5d82e9e48000022',
                        name: 'NFT test 2',
                        address: 'addressnft2',
                        image: {
                            _id: '619d27eaf5d82e9e48000002',
                            filename: 'nftimg2.png',
                            originalname: 'nftimg2.png',
                            mimetype: 'image/png',
                            size: 1112
                        }
                    }]);
                });
        });
    });

    describe('POST /nfts', () => {
        it('should return unauthorized', function() {
            return request(application)
                .post('/api/nfts')
                .send({
                    name: 'new nft',
                    address: 'addressnft_nuevo'
                })
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => {
                    return NFT.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });

    describe('DELETE /nfts/:id', () => {
        it('should return unauthorized', function() {
            return request(application)
                .delete('/api/nfts/619d27eaf5d82e9e48000022')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => {
                    return NFT.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });
});
