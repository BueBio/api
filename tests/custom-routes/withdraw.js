'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {Vault, WalletVault, WalletMovement} = require('@models');

describe('POST /api/withdraw', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
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
                description: 'Another vault',
                scoring: 1,
                apy: 9.2,
                image: '619d27eaf5d82e9e48000002',
                walletAddress: 'addressvault2'
            })
        ]);
    });
    
    beforeEach(() => {
        return WalletVault.create({
            _id: '619d27eaf5d82e9e48000021',
            address: 'addressofwallet01',
            vault: '619d27eaf5d82e9e48000011',
            balance: 1500
        });
    });
    
    afterEach(() => {
        return Promise.all([
            WalletVault.deleteMany({}),
            WalletMovement.deleteMany({})
        ]);
    });

    after(() => {
        return Vault.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    it('should fail without vault', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                amount: 1000
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid fields - "vault" is required');
            });
    });

    it('should fail without walletAddress', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                vault: '619d27eaf5d82e9e48000011',
                amount: 1000
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid fields - "walletAddress" is required');
            });
    });

    it('should fail without amount', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000011'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid fields - "amount" is required');
            });
    });

    it('should fail with invalid amount', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000011',
                amount: -10
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid fields - "amount" must be greater than 0');
            });
    });

    it('should fail with invalid vault', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000019',
                amount: 1000
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_vault');
                response.body.message.should.be.equal('Invalid vault');
            });
    });

    it('should fail without enought balance', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000011',
                amount: 2000
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('not_enought_balance');
                response.body.message.should.be.equal('Not enought balance');
            });
    });

    it('should fail without balance', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000012',
                amount: 1000
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('not_enought_balance');
                response.body.message.should.be.equal('Not enought balance');
            });
    });

    it('should save pending movement', function() {
        return request(application)
            .post('/api/withdraw')
            .set('Accept', 'application/json')
            .send({
                walletAddress: 'addressofwallet01',
                vault: '619d27eaf5d82e9e48000011',
                amount: 1000
            })
            .expect(200)
            .then(() => {
                return WalletVault.find();
            })
            .then((wallets) => {
                wallets.should.have.length(1);
                wallets[0]._id.toString().should.be.equal('619d27eaf5d82e9e48000021');
                wallets[0].address.should.be.equal('addressofwallet01');
                wallets[0].vault.toString().should.be.equal('619d27eaf5d82e9e48000011');
                wallets[0].balance.should.be.equal(1500);
                return WalletMovement.find();
            })
            .then((movements) => {
                movements.should.have.length(1);
                movements[0].type.should.be.equal('withdraw');
                movements[0].walletAddress.should.be.equal('addressofwallet01');
                movements[0].vault.toString().should.be.equal('619d27eaf5d82e9e48000011');
                movements[0].amount.should.be.equal(1000);
                movements[0].status.should.be.equal('pending');
            });
    });
});
