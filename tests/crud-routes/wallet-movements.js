'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {signMessage} = require('@tests/mocks/signature');
const {Vault, File, WalletMovement, Wallet} = require('@models');

describe('WalletMovements', function() {
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
            }),
            WalletMovement.create({
                _id: '619d27eaf5d82e9e48000021',
                type: 'deposit',
                walletAddress: process.env.TESTING_WALLET01_ADDRESS,
                vault: '619d27eaf5d82e9e48000011',
                transactionHash: 'faketransactionhash01',
                amount: 15200,
                status: 'success'
            }),
            WalletMovement.create({
                _id: '619d27eaf5d82e9e48000022',
                type: 'withdraw',
                walletAddress: process.env.TESTING_WALLET02_ADDRESS,
                vault: '619d27eaf5d82e9e48000012',
                amount: 2000,
                status: 'pending'
            }),
            Wallet.create({
                _id: '619d27eaf5d82e9e48000031',
                address: process.env.TESTING_WALLET01_ADDRESS,
                role: 'admin'
            }),
            Wallet.create({
                _id: '619d27eaf5d82e9e48000032',
                address: process.env.TESTING_WALLET02_ADDRESS,
                role: 'user'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            File.deleteMany({}),
            Vault.deleteMany({}),
            WalletMovement.deleteMany({}),
            Wallet.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET /walletmovements', () => {
        it('should return unauthorized without autentication', function() {
            return request(application)
                .get('/api/walletmovements')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('should return unauthorized with expired autentication', function() {
            const authTimestamp = new Date().getTime() - (61 * 60 * 1000); // hace 61 minutos
            return signMessage(authTimestamp.toString(), process.env.TESTING_WALLET01_PRIVATE_KEY)
                .then((authSignature) => {
                    return request(application)
                        .get('/api/walletmovements')
                        .set('Accept', 'application/json')
                        .query({
                            authTimestamp,
                            authSignature
                        })
                        .expect(401);
                })
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('should return unauthorized without admin role', function() {
            const authTimestamp = new Date().getTime() - (5 * 60 * 1000); // hace 5 minutos
            return signMessage(authTimestamp.toString(), process.env.TESTING_WALLET02_PRIVATE_KEY)
                .then((authSignature) => {
                    return request(application)
                        .get('/api/walletmovements')
                        .set('Accept', 'application/json')
                        .query({
                            authTimestamp,
                            authSignature
                        })
                        .expect(401);
                })
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('should return unauthorized without registered wallet', function() {
            const authTimestamp = new Date().getTime() - (5 * 60 * 1000); // hace 5 minutos
            return signMessage(authTimestamp.toString(), process.env.TESTING_WALLET03_PRIVATE_KEY)
                .then((authSignature) => {
                    return request(application)
                        .get('/api/walletmovements')
                        .set('Accept', 'application/json')
                        .query({
                            authTimestamp,
                            authSignature
                        })
                        .expect(401);
                })
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('should return all movements', function() {
            const authTimestamp = new Date().getTime() - (5 * 60 * 1000); // hace 5 minutos
            return signMessage(authTimestamp.toString(), process.env.TESTING_WALLET01_PRIVATE_KEY)
                .then((authSignature) => {
                    return request(application)
                        .get('/api/walletmovements')
                        .set('Accept', 'application/json')
                        .query({
                            authTimestamp,
                            authSignature
                        })
                        .expect(200);
                })
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000021',
                        type: 'deposit',
                        walletAddress: process.env.TESTING_WALLET01_ADDRESS,
                        vault: '619d27eaf5d82e9e48000011',
                        transactionHash: 'faketransactionhash01',
                        amount: 15200,
                        status: 'success'
                    }, {
                        _id: '619d27eaf5d82e9e48000022',
                        type: 'withdraw',
                        walletAddress: process.env.TESTING_WALLET02_ADDRESS,
                        vault: '619d27eaf5d82e9e48000012',
                        amount: 2000,
                        status: 'pending'
                    }]);
                });
        });

        it('should return all movements - with sort and populate', function() {
            const authTimestamp = new Date().getTime() - (5 * 60 * 1000); // hace 5 minutos
            return signMessage(authTimestamp.toString(), process.env.TESTING_WALLET01_PRIVATE_KEY)
                .then((authSignature) => {
                    return request(application)
                        .get('/api/walletmovements')
                        .set('Accept', 'application/json')
                        .query({
                            sort: 'amount',
                            populate: 'vault',
                            authTimestamp,
                            authSignature
                        })
                        .expect(200);
                })
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body[0]._id.should.be.equal('619d27eaf5d82e9e48000022');
                    response.body[1]._id.should.be.equal('619d27eaf5d82e9e48000021');
                    response.body.should.containDeep([{
                        _id: '619d27eaf5d82e9e48000022',
                        type: 'withdraw',
                        walletAddress: process.env.TESTING_WALLET02_ADDRESS,
                        vault: {
                            _id: '619d27eaf5d82e9e48000012',
                            name: 'Vault test 2',
                            description: 'Second vault',
                            scoring: 2,
                            apy: 22.2,
                            image: '619d27eaf5d82e9e48000002',
                            walletAddress: 'addressvault2'
                        },
                        amount: 2000,
                        status: 'pending'
                    }, {
                        _id: '619d27eaf5d82e9e48000021',
                        type: 'deposit',
                        walletAddress: process.env.TESTING_WALLET01_ADDRESS,
                        vault: {
                            _id: '619d27eaf5d82e9e48000011',
                            name: 'Vault test 1',
                            description: 'One vault',
                            scoring: 1,
                            apy: 11.1,
                            image: '619d27eaf5d82e9e48000001',
                            walletAddress: 'addressvault1'
                        },
                        transactionHash: 'faketransactionhash01',
                        amount: 15200,
                        status: 'success'
                    }]);
                });
        });
    });

    describe('POST /walletmovements', () => {
        it('should return unauthorized', function() {
            return request(application)
                .post('/api/walletmovements')
                .send({
                    type: 'withdraw',
                    walletAddress: 'addresswallet04',
                    vault: '619d27eaf5d82e9e48000011',
                    amount: 4000,
                    status: 'pending'
                })
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                    return WalletMovement.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });

    describe('DELETE /walletmovements/:id', () => {
        it('should return unauthorized', function() {
            return request(application)
                .delete('/api/walletmovements/619d27eaf5d82e9e48000021')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                    return WalletMovement.count();
                })
                .then((quantity) => {
                    quantity.should.be.equal(2);
                });
        });
    });
});
