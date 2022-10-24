'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {ProductionRewardCode} = require('@models');

describe('ProductionRewardCode', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return ProductionRewardCode.create({
            _id: '00000000000000aabb000001',
            production: '00000000000000aaac000001',
            code: 'TESTINGCODE01',
            status: 'used',
            walletAddress: 'fakewalletaddress01'
        });
    });

    after(() => {
        return ProductionRewardCode.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/productionrewardcodes - should return Unauthorized', function() {
            return request(application)
                .get('/api/productionrewardcodes')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/productionrewardcodes/:id - should return Unauthorized', function() {
            return request(application)
                .get('/api/productionrewardcodes/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('PUT', () => {
        it('/productionrewardcodes/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/productionrewardcodes/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    code: 'TESTINGNEWCODE'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/productionrewardcodes/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/productionrewardcodes/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('POST', () => {
        it('/productionrewardcodes - should return Unauthorized', function() {
            return request(application)
                .post('/api/productionrewardcodes')
                .set('Accept', 'application/json')
                .send({
                    production: '00000000000000aaac000002',
                    code: 'TESTINGCODE02',
                    status: 'available'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});
