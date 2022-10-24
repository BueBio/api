'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {
    File,
    FutureProductionOffer,
    Producer,
    User
} = require('@models');

describe('FutureProductionOffer', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
            Producer.create({
                _id: '00000000000000aaaa000001',
                name: 'Testing company 01',
                description: 'This is a testing company with id 01',
                logo: '00000000000000aaee000001'
            }),
            Producer.create({
                _id: '00000000000000aaaa000002',
                name: 'Testing company 02',
                description: 'This is a testing company with id 02',
                logo: '00000000000000aaee000003'
            }),
            File.create({
                _id: '00000000000000aacc000001',
                originalname: 'Testing file 01.png',
                filename: '1658229833945_testing-file-01.png',
                mimetype: 'image/png',
                size: 1231
            }),
            File.create({
                _id: '00000000000000aacc000002',
                originalname: 'Testing file 02.png',
                filename: '1658229833945_testing-file-02.png',
                mimetype: 'image/png',
                size: 1232
            }),
            File.create({
                _id: '00000000000000aacc000003',
                originalname: 'Testing file 03.png',
                filename: '1658229833945_testing-file-03.png',
                mimetype: 'image/png',
                size: 1233
            }),
            File.create({
                _id: '00000000000000aacc000004',
                originalname: 'Testing file 04.png',
                filename: '1658229833945_testing-file-04.png',
                mimetype: 'image/png',
                size: 1234
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
            }),
            User.create({
                _id: process.env.TESTING_ADMIN_01_ID,
                email: process.env.TESTING_ADMIN_01_EMAIL,
                fullName: 'Admin testing 01',
                role: 'admin'
            }),
            User.create({
                _id: process.env.TESTING_PRODUCER_01_ID,
                email: process.env.TESTING_PRODUCER_01_EMAIL,
                fullName: 'Producer testing 01',
                role: 'producer',
                producer: '00000000000000aaaa000001'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            File.deleteMany({}),
            Producer.deleteMany({}),
            FutureProductionOffer.deleteMany({}),
            User.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/futureproductionoffers - should return Unauthorized', function() {
            return request(application)
                .get('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/futureproductionoffers/:id - should return Unauthorized', function() {
            return request(application)
                .get('/api/futureproductionoffers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/futureproductionoffers - should return all with admin role', function() {
            return request(application)
                .get('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
                .query({
                    sort: 'publishedAt'
                })
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(3);
                    response.body[0]._id.toString().should.be.equal('00000000000000aabb000001');
                    response.body[1]._id.toString().should.be.equal('00000000000000aabb000002');
                    response.body[2]._id.toString().should.be.equal('00000000000000aabb000003');
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

        it('/futureproductionoffers - should return with conditions and populate', function() {
            return request(application)
                .get('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
                .query({
                    conditions: {
                        status: 'active'
                    },
                    populate: 'producer image'
                })
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
                    response.body.should.containDeep([{
                        _id: '00000000000000aabb000001',
                        producer: {
                            _id: '00000000000000aaaa000001',
                            name: 'Testing company 01',
                            description: 'This is a testing company with id 01',
                            logo: '00000000000000aaee000001'
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
                    }, {
                        _id: '00000000000000aabb000003',
                        producer: {
                            _id: '00000000000000aaaa000002',
                            name: 'Testing company 02',
                            description: 'This is a testing company with id 02',
                            logo: '00000000000000aaee000003'
                        },
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
                        image: {
                            _id: '00000000000000aacc000001',
                            originalname: 'Testing file 01.png',
                            filename: '1658229833945_testing-file-01.png',
                            mimetype: 'image/png',
                            size: 1231
                        },
                        status: 'active'
                    }]);
                });
        });

        it('/futureproductionoffers - should return filtered with producer token', function() {
            return request(application)
                .get('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
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

        it('/futureproductionoffers - should return filtered with conditions and producer token', function() {
            return request(application)
                .get('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
                .query({
                    conditions: {
                        productName: 'Miel orgánica'
                    }
                })
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(2);
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

        it('/futureproductionoffers/:id - should return data with admin role', function() {
            return request(application)
                .get('/api/futureproductionoffers/00000000000000aabb000002')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
                .query({
                    populate: 'image'
                })
                .expect(200)
                .then((response) => {
                    response.body._id.should.be.equal('00000000000000aabb000002');
                    response.body.producer.should.be.equal('00000000000000aaaa000001');
                    response.body.productName.should.be.equal('Miel orgánica');
                    response.body.productDescription.should.be.equal('Frasco de 500mg');
                    response.body.publishedAt.should.be.equal('2022-07-19T15:45:00.000Z');
                    response.body.totalQuantity.should.be.equal(500);
                    response.body.availableQuantity.should.be.equal(450);
                    response.body.image._id.should.be.equal('00000000000000aacc000001');
                    response.body.image.originalname.should.be.equal('Testing file 01.png');
                    response.body.image.filename.should.be.equal('1658229833945_testing-file-01.png');
                    response.body.image.mimetype.should.be.equal('image/png');
                    response.body.image.size.should.be.equal(1231);
                    response.body.status.should.be.equal('pending');
                });
        });
    });

    describe('PUT', () => {
        it('/futureproductionoffers/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/futureproductionoffers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    priceAmount: 50
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/futureproductionoffers/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/futureproductionoffers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('POST', () => {
        it('/futureproductionoffers - should return Unauthorized', function() {
            return request(application)
                .post('/api/futureproductionoffers')
                .set('Accept', 'application/json')
                .send({
                    producer: '00000000000000aaaa000001',
                    productName: 'Product testing 02',
                    productDescription: 'Bottle of 700mg',
                    description: 'An future production offer description 02',
                    publishedAt: new Date('2022-05-06T03:00:00.000Z'),
                    expiredAt: new Date('2022-07-18T03:00:00.000Z'),
                    availabledAt: new Date('2022-10-04T03:00:00.000Z'),
                    totalQuantity: 3000,
                    availableQuantity: 2500,
                    priceTokenAddress: 'afaketokenaddress02',
                    priceTokenSymbol: 'USDT',
                    priceTokenDecimals: 16,
                    priceAmount: 10.074 * 10 ** 16,
                    image: '00000000000000aaac000002',
                    status: 'pending'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});
