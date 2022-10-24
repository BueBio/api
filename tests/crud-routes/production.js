'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {File, Producer, Production, User} = require('@models');

describe('Production', function() {
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
            Production.create({
                _id: '00000000000000aabb000001',
                producer: '00000000000000aaaa000001',
                productName: 'Miel orgánica',
                productDescription: 'Frasco de 200mg',
                producedAt: new Date('2022-04-01T03:00:00.000Z'),
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                batch: '00010035',
                totalQuantity: 500,
                availableQuantity: 420,
                image: '00000000000000aacc000001',
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aabb000002',
                producer: '00000000000000aaaa000001',
                productName: 'Miel orgánica',
                productDescription: 'Frasco de 500mg',
                producedAt: new Date('2022-04-03T03:00:00.000Z'),
                batch: '00010036',
                totalQuantity: 200,
                availableQuantity: 200,
                image: '00000000000000aacc000002',
                status: 'pending'
            }),
            Production.create({
                _id: '00000000000000aabb000003',
                producer: '00000000000000aaaa000002',
                productName: 'Manta',
                productDescription: '1.60m x 1m',
                producedAt: new Date('2022-04-02T03:00:00.000Z'),
                batch: '00020070',
                totalQuantity: 50,
                availableQuantity: 15,
                image: '00000000000000aacc000004',
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
            Production.deleteMany({}),
            User.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/productions - should return Unauthorized without token', function() {
            return request(application)
                .get('/api/productions')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/productions - should return all with admin role', function() {
            return request(application)
                .get('/api/productions')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
                .query({
                    sort: 'producedAt'
                })
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(3);
                    response.body[0]._id.toString().should.be.equal('00000000000000aabb000001');
                    response.body[1]._id.toString().should.be.equal('00000000000000aabb000003');
                    response.body[2]._id.toString().should.be.equal('00000000000000aabb000002');
                    response.body.should.containDeep([{
                        _id: '00000000000000aabb000001',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 200mg',
                        producedAt: '2022-04-01T03:00:00.000Z',
                        publishedAt: '2022-07-18T15:45:00.000Z',
                        batch: '00010035',
                        totalQuantity: 500,
                        availableQuantity: 420,
                        image: '00000000000000aacc000001',
                        status: 'active'
                    }, {
                        _id: '00000000000000aabb000002',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 500mg',
                        producedAt: '2022-04-03T03:00:00.000Z',
                        batch: '00010036',
                        totalQuantity: 200,
                        availableQuantity: 200,
                        image: '00000000000000aacc000002',
                        status: 'pending'
                    }, {
                        _id: '00000000000000aabb000003',
                        producer: '00000000000000aaaa000002',
                        productName: 'Manta',
                        productDescription: '1.60m x 1m',
                        producedAt: '2022-04-02T03:00:00.000Z',
                        batch: '00020070',
                        totalQuantity: 50,
                        availableQuantity: 15,
                        image: '00000000000000aacc000004',
                        status: 'active'
                    }]);
                });
        });

        it('/productions - should return with conditions and populate', function() {
            return request(application)
                .get('/api/productions')
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
                        producedAt: '2022-04-01T03:00:00.000Z',
                        publishedAt: '2022-07-18T15:45:00.000Z',
                        batch: '00010035',
                        totalQuantity: 500,
                        availableQuantity: 420,
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
                        producedAt: '2022-04-02T03:00:00.000Z',
                        batch: '00020070',
                        totalQuantity: 50,
                        availableQuantity: 15,
                        image: {
                            _id: '00000000000000aacc000004',
                            originalname: 'Testing file 04.png',
                            filename: '1658229833945_testing-file-04.png',
                            mimetype: 'image/png',
                            size: 1234
                        },
                        status: 'active'
                    }]);
                });
        });

        it('/productions - should return filtered with producer token', function() {
            return request(application)
                .get('/api/productions')
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
                        producedAt: '2022-04-01T03:00:00.000Z',
                        publishedAt: '2022-07-18T15:45:00.000Z',
                        batch: '00010035',
                        totalQuantity: 500,
                        availableQuantity: 420,
                        image: '00000000000000aacc000001',
                        status: 'active'
                    }, {
                        _id: '00000000000000aabb000002',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 500mg',
                        producedAt: '2022-04-03T03:00:00.000Z',
                        batch: '00010036',
                        totalQuantity: 200,
                        availableQuantity: 200,
                        image: '00000000000000aacc000002',
                        status: 'pending'
                    }]);
                });
        });

        it('/productions - should return filtered with conditions and producer token', function() {
            return request(application)
                .get('/api/productions')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
                .query({
                    conditions: {
                        totalQuantity: {
                            $gt: 250
                        }
                    }
                })
                .expect(200)
                .then((response) => {
                    response.body.should.have.length(1);
                    response.body.should.containDeep([{
                        _id: '00000000000000aabb000001',
                        producer: '00000000000000aaaa000001',
                        productName: 'Miel orgánica',
                        productDescription: 'Frasco de 200mg',
                        producedAt: '2022-04-01T03:00:00.000Z',
                        publishedAt: '2022-07-18T15:45:00.000Z',
                        batch: '00010035',
                        totalQuantity: 500,
                        availableQuantity: 420,
                        image: '00000000000000aacc000001',
                        status: 'active'
                    }]);
                });
        });

        it('/productions/:id - should return Unauthorized without token', function() {
            return request(application)
                .get('/api/productions/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/productions/:id - should return data with admin role', function() {
            return request(application)
                .get('/api/productions/00000000000000aabb000002')
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
                    response.body.producedAt.should.be.equal('2022-04-03T03:00:00.000Z');
                    response.body.batch.should.be.equal('00010036');
                    response.body.totalQuantity.should.be.equal(200);
                    response.body.availableQuantity.should.be.equal(200);
                    response.body.image._id.should.be.equal('00000000000000aacc000002');
                    response.body.image.originalname.should.be.equal('Testing file 02.png');
                    response.body.image.filename.should.be.equal('1658229833945_testing-file-02.png');
                    response.body.image.mimetype.should.be.equal('image/png');
                    response.body.image.size.should.be.equal(1232);
                    response.body.status.should.be.equal('pending');
                });
        });
    });

    describe('PUT', () => {
        it('/productions/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/productions/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    productName: 'Nombre cambiado'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/productions/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/productions/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});
