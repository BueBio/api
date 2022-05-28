'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {Vault, File} = require('@models');

describe('Vaults', function() {
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
                filename: 'vaultimg1.png',
                originalname: 'vaultimg1.png',
                mimetype: 'image/png',
                size: 1111
            }),
            File.create({
                _id: '619d27eaf5d82e9e48000002',
                filename: 'vaultimg2.png',
                originalname: 'vaultimg2.png',
                mimetype: 'image/png',
                size: 1112
            }),
            Vault.create({
                _id: '619d27eaf5d82e9e48000011',
                name: 'Vault test 1',
                description: 'One vault',
                scoring: 1,
                apy: 11.1,
                image: '619d27eaf5d82e9e48000001',
                walletAddress: 'addressvault1'
            }),
            Vault.create({
                _id: '619d27eaf5d82e9e48000012',
                name: 'Vault test 2',
                description: 'Second vault',
                scoring: 2,
                apy: 22.2,
                image: '619d27eaf5d82e9e48000002',
                walletAddress: 'addressvault2'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            File.deleteMany({}),
            Vault.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET /vaults', () => {
        it('should return all vaults', function() {
            return request(application)
                .get('/api/vaults')
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000011',
                        name: 'Vault test 1',
                        description: 'One vault',
                        scoring: 1,
                        apy: 11.1,
                        image: '619d27eaf5d82e9e48000001',
                        walletAddress: 'addressvault1'
                    }, {
                        _id: '619d27eaf5d82e9e48000012',
                        name: 'Vault test 2',
                        description: 'Second vault',
                        scoring: 2,
                        apy: 22.2,
                        image: '619d27eaf5d82e9e48000002',
                        walletAddress: 'addressvault2'
                    }]);
                });
        });

        it('should return nfts withimages', function() {
            return request(application)
                .get('/api/vaults')
                .query({
                    populate: 'image'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000011',
                        name: 'Vault test 1',
                        description: 'One vault',
                        scoring: 1,
                        apy: 11.1,
                        image: {
                            _id: '619d27eaf5d82e9e48000001',
                            filename: 'vaultimg1.png',
                            originalname: 'vaultimg1.png',
                            mimetype: 'image/png',
                            size: 1111
                        },
                        walletAddress: 'addressvault1'
                    }, {
                        _id: '619d27eaf5d82e9e48000012',
                        name: 'Vault test 2',
                        description: 'Second vault',
                        scoring: 2,
                        apy: 22.2,
                        image: {
                            _id: '619d27eaf5d82e9e48000002',
                            filename: 'vaultimg2.png',
                            originalname: 'vaultimg2.png',
                            mimetype: 'image/png',
                            size: 1112
                        },
                        walletAddress: 'addressvault2'
                    }]);
                });
        });
    });

    describe('POST /vaults', () => {
        it('should return unauthorized', function() {
            return request(application)
                .post('/api/vaults')
                .send({
                    name: 'new vault',
                    description: 'a new vault',
                    scoring: 3,
                    apy: 33.3,
                    walletAddress: 'addressvault_nuevo'
                })
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => {
                    return Vault.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });

    describe('DELETE /vaults/:id', () => {
        it('should return unauthorized', function() {
            return request(application)
                .delete('/api/vaults/619d27eaf5d82e9e48000012')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => {
                    return Vault.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });
});
