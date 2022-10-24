'use strict';
const app = require('../mocks/app');
const request = require('supertest');
require('should');
const events = require('@tests/mocks/events');
const {FutureProductionOffer} = require('@models');
const TOKEN_ADMIN = process.env.TESTING_ADMIN_01_TOKEN;
const TOKEN_PRODUCER = process.env.TESTING_PRODUCER_01_TOKEN;

describe('POST /futureproductionoffers/:id/reject', () => {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return FutureProductionOffer.deleteMany({});
            })
            .then(() => {
                return Promise.all([
                    FutureProductionOffer.create({
                        _id: '00000000000000aabb000001',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 200mg',
                        description: 'Frasco de 200mg',
                        publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                        expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                        availabledAt: new Date('2022-12-06T03:00:00.000Z'),
                        totalQuantity: 500,
                        availableQuantity: 450,
                        priceTokenAddress: '0x0000000000000000000000000000000000000000',
                        priceTokenSymbol: 'MO200',
                        priceTokenDecimals: 1,
                        image: '00000000000000aacc000001',
                        status: 'pending'
                    }),
                    FutureProductionOffer.create({
                        _id: '00000000000000aabb000002',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 500mg',
                        description: 'Frasco de 500mg',
                        publishedAt: new Date('2022-07-19T15:45:00.000Z'),
                        expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                        availabledAt: new Date('2022-12-06T03:00:00.000Z'),
                        totalQuantity: 500,
                        availableQuantity: 450,
                        priceTokenAddress: '0x0000000000000000000000000000000000000001',
                        priceTokenSymbol: 'MO500',
                        priceTokenDecimals: 1,
                        image: '00000000000000aacc000001',
                        status: 'active'
                    })
                ]);
            });
    });

    afterEach(() => {
        events.reset();
    });

    after(() => {
        return FutureProductionOffer.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    it('Should return unauthorized without token', function() {
        return request(application)
            .post('/api/futureproductionoffers/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return unauthorized with role producer ', function() {
        return request(application)
            .post('/api/futureproductionoffers/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_PRODUCER}`)
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return future production not found', function() {
        return request(application)
            .post('/api/futureproductionoffers/00000000000000aabb000005/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Future production not found');
                response.body.code.should.be.equal('future_production_not_found');
            });
    });

    it('Should return future production is not pending', function() {
        return request(application)
            .post('/api/futureproductionoffers/00000000000000aabb000002/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Future production is not pending');
                response.body.code.should.be.equal('future_production_is_not_pending');
            });
    });

    it('Should change state future production to active', function() {
        const actualDate = new Date();
        return request(application)
            .post('/api/futureproductionoffers/00000000000000aabb000001/reject')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${TOKEN_ADMIN}`)
            .expect(200)
            .then((response) => {
                response.statusCode.should.be.equal(200);
                return FutureProductionOffer.findById('00000000000000aabb000001');
            })
            .then((futureProduction) => {
                futureProduction.status.should.be.equal('rejected');
                futureProduction.publishedAt.should.be.belowOrEqual(new Date());
                futureProduction.publishedAt.should.be.aboveOrEqual(actualDate);
            });
    });
});
