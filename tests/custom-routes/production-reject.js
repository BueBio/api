'use strict';

const app = require('../mocks/app');
const request = require('supertest');
require('should');
const {Production} = require('@models');
const TOKEN_ADMIN = process.env.TESTING_ADMIN_01_TOKEN;
const TOKEN_PRODUCER = process.env.TESTING_PRODUCER_01_TOKEN;

describe('POST /productions/:id/reject', () => {
    let application;
    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return Production.deleteMany({});
            })
            .then(() => {
                return Promise.all([
                    Production.create({
                        _id: '00000000000000aabb000001',
                        productName: 'Product example 1',
                        productDescription: 'Description product example 1',
                        producedAt: new Date(),
                        publishedAt: new Date(),
                        batch: 'LK-103',
                        totalQuantity: 10,
                        availableQuantity: 4,
                        status: 'pending'
                    }),
                    Production.create({
                        _id: '00000000000000aabb000002',
                        productName: 'Product example 2',
                        productDescription: 'Description product example 2',
                        producedAt: new Date(),
                        publishedAt: new Date(),
                        batch: 'LKML-9782',
                        totalQuantity: 105,
                        availableQuantity: 98,
                        status: 'active'
                    })
                ]);
            });
    });

    after(() => {
        return Production.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    it('Should return unauthorized without token', function() {
        return request(application)
            .post('/api/productions/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return unauthorized with role producer ', function() {
        return request(application)
            .post('/api/productions/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_PRODUCER}`)
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return production not found', function() {
        return request(application)
            .post('/api/productions/00000000000000aabb000005/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Production not found');
                response.body.code.should.be.equal('production_not_found');
            });
    });

    it('Should return production is not pending', function() {
        return request(application)
            .post('/api/productions/00000000000000aabb000002/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Production is not pending');
                response.body.code.should.be.equal('production_is_not_pending');
            });
    });

    it('Should change state production to rejected', function() {
        return request(application)
            .post('/api/productions/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(200)
            .then((response) => {
                response.statusCode.should.be.equal(200);
                return Production.findById('00000000000000aabb000001');
            })
            .then((production) => {
                production.status.should.be.equal('rejected');
            });
    });
});
