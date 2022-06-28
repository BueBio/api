'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {Wallet} = require('@models');

describe('GET /api/wallets/:address/isadmin', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
            Wallet.create({
                address: 'addressofwallet01',
                role: 'admin'
            }),
            Wallet.create({
                address: 'addressofwallet02',
                role: 'user'
            })
        ]);
    });
    
    after(() => {
        return Wallet.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    it('should return false with non-identified address', function() {
        return request(application)
            .get('/api/wallets/addressofwallet03/isadmin')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.isAdmin.should.be.equal(false);
            });
    });

    it('should return false with non-admin wallet', function() {
        return request(application)
            .get('/api/wallets/addressofwallet02/isadmin')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.isAdmin.should.be.equal(false);
            });
    });

    it('should return true with admin wallet', function() {
        return request(application)
            .get('/api/wallets/addressofwallet01/isadmin')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.isAdmin.should.be.equal(true);
            });
    });
});
