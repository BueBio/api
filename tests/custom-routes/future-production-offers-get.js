'use strict';
const app = require('../mocks/app');
const request = require('supertest');
require('should');
const events = require('@tests/mocks/events');
const {FutureProductionOffer, File, Producer} = require('@models');

describe('GET /future/production/offers', () => {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return FutureProductionOffer.deleteMany({});
            })
            .then(() => {
                return Promise.all([
                    File.create({
                        _id: '00000000000000aacc000001',
                        originalname: 'Testing file 01.png',
                        filename: '1658229833945_testing-file-01.png',
                        mimetype: 'image/png',
                        size: 1231
                    }),
                    File.create({
                        _id: '00000000000000aaee000003',
                        originalname: 'Testing file 03.png',
                        filename: '1658229833945_testing-file-03.png',
                        mimetype: 'image/png',
                        size: 1233
                    }),
                    Producer.create({
                        _id: '00000000000000aaaa000001',
                        name: 'Testing company 02',
                        description: 'This is a testing company with id 02',
                        logo: '00000000000000aaee000003'
                    }),
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
                        status: 'active'
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
                        status: 'pending'
                    }),
                    FutureProductionOffer.create({
                        _id: '00000000000000aabb000003',
                        producer: '00000000000000aaaa000002',
                        productName: 'Manta',
                        productDescription: '1.60m x 1m',
                        description: '1.60m x 1m',
                        publishedAt: new Date('2022-07-26T15:45:00.000Z'),
                        expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                        availabledAt: new Date('2022-12-06T03:00:00.000Z'),
                        totalQuantity: 500,
                        availableQuantity: 450,
                        priceTokenAddress: '0x0000000000000000000000000000000000000002',
                        priceTokenSymbol: 'M160',
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

    it('Should return all data from the db', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.should.have.length(3);
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000001',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 200mg',
                    description: 'Frasco de 200mg',
                    publishedAt: '2022-07-18T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000000',
                    priceTokenSymbol: 'MO200',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }, {
                    _id: '00000000000000aabb000003',
                    producer: '00000000000000aaaa000002',
                    productName: 'Manta',
                    productDescription: '1.60m x 1m',
                    description: '1.60m x 1m',
                    publishedAt: '2022-07-26T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000002',
                    priceTokenSymbol: 'M160',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }, {
                    _id: '00000000000000aabb000002',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 500mg',
                    description: 'Frasco de 500mg',
                    publishedAt: '2022-07-19T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000001',
                    priceTokenSymbol: 'MO500',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'pending'
                }]);

            });
    });

    it('Should return data with sort', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                sort: 'priceTokenAddress'
            })
            .expect(200)
            .then((response) => {
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000003',
                    producer: '00000000000000aaaa000002',
                    productName: 'Manta',
                    productDescription: '1.60m x 1m',
                    description: '1.60m x 1m',
                    publishedAt: '2022-07-26T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000002',
                    priceTokenSymbol: 'M160',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                },
                {
                    _id: '00000000000000aabb000002',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 500mg',
                    description: 'Frasco de 500mg',
                    publishedAt: '2022-07-19T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000001',
                    priceTokenSymbol: 'MO500',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'pending'
                },
                {
                    _id: '00000000000000aabb000001',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 200mg',
                    description: 'Frasco de 200mg',
                    publishedAt: '2022-07-18T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000000',
                    priceTokenSymbol: 'MO200',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }]);
            });
    });

    it('Should return data with sort and skip', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                sort: 'priceTokenAddress',
                skip: 1
            })
            .expect(200)
            .then((response) => {
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000002',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 500mg',
                    description: 'Frasco de 500mg',
                    publishedAt: '2022-07-19T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000001',
                    priceTokenSymbol: 'MO500',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'pending'
                },
                {
                    _id: '00000000000000aabb000003',
                    producer: '00000000000000aaaa000002',
                    productName: 'Manta',
                    productDescription: '1.60m x 1m',
                    description: '1.60m x 1m',
                    publishedAt: '2022-07-26T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000002',
                    priceTokenSymbol: 'M160',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }]);
            });
    });

    it('Should return data with sort and limit', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                sort: 'priceTokenSymbol',
                limit: 2
            })
            .expect(200)
            .then((response) => {
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000001',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 200mg',
                    description: 'Frasco de 200mg',
                    publishedAt: '2022-07-18T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000000',
                    priceTokenSymbol: 'MO200',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                },
                {
                    _id: '00000000000000aabb000003',
                    producer: '00000000000000aaaa000002',
                    productName: 'Manta',
                    productDescription: '1.60m x 1m',
                    description: '1.60m x 1m',
                    publishedAt: '2022-07-26T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000002',
                    priceTokenSymbol: 'M160',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }]);
            });
    });

    it('Should return data with sort, skip and limt', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                sort: 'priceTokenAddress',
                skip: 1,
                limit: 1
            })
            .expect(200)
            .then((response) => {
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000002',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 500mg',
                    description: 'Frasco de 500mg',
                    publishedAt: '2022-07-19T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000001',
                    priceTokenSymbol: 'MO500',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'pending'
                }]);
            });
    });

    it('Should return length with count', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                count: true
            })
            .expect(200)
            .then((response) => {
                response.body.should.be.equal(3);
            });
    });

    it('Should return data length with count and search', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                search: {
                    status: 'active'
                },
                count: true
            })
            .expect(200)
            .then((response) => {
                response.body.should.be.equal(2);
            });
    });

    it('Should return data with search', function() {
        return request(application)
            .get('/api/future/production/offers')
            .set('Accept', 'application/json')
            .query({
                search: {
                    productName: 'Miel orgánica'
                }
            })
            .expect(200)
            .then((response) => {
                response.body.should.containDeep([{
                    _id: '00000000000000aabb000002',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 500mg',
                    description: 'Frasco de 500mg',
                    publishedAt: '2022-07-19T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000001',
                    priceTokenSymbol: 'MO500',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'pending'
                },
                {
                    _id: '00000000000000aabb000001',
                    producer: '00000000000000aaaa000001',
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 200mg',
                    description: 'Frasco de 200mg',
                    publishedAt: '2022-07-18T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000000',
                    priceTokenSymbol: 'MO200',
                    priceTokenDecimals: 1,
                    image: '00000000000000aacc000001',
                    status: 'active'
                }]);
            });
    });
    it('Should return data by id', function() {
        return request(application)
            .get('/api/future/production/offers/00000000000000aabb000001')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.should.containDeep({
                    _id: '00000000000000aabb000001',
                    producer: {
                        _id: '00000000000000aaaa000001',
                        name: 'Testing company 02',
                        description: 'This is a testing company with id 02',
                        logo: {
                            _id: '00000000000000aaee000003',
                            originalname: 'Testing file 03.png',
                            filename: '1658229833945_testing-file-03.png',
                            mimetype: 'image/png',
                            size: 1233
                        }
                    },
                    productName: 'Miel orgánica',
                    productDescription: 'Frasco de 200mg',
                    description: 'Frasco de 200mg',
                    publishedAt: '2022-07-18T15:45:00.000Z',
                    expiredAt: '2022-12-04T03:00:00.000Z',
                    availabledAt: '2022-12-06T03:00:00.000Z',
                    totalQuantity: 500,
                    availableQuantity: 450,
                    priceTokenAddress: '0x0000000000000000000000000000000000000000',
                    priceTokenSymbol: 'MO200',
                    priceTokenDecimals: 1,
                    image: {
                        _id: '00000000000000aacc000001',
                        originalname: 'Testing file 01.png',
                        filename: '1658229833945_testing-file-01.png',
                        mimetype: 'image/png',
                        size: 1231
                    },
                    status: 'active'
                });
            });
    });
});
