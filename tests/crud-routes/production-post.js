'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {File, Producer, Production, User} = require('@models');

describe('POST /productions', function() {
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
                _id: '00000000000000aaee000001',
                originalname: 'Testing file 01.png',
                filename: '1658229833945_testing-file-01.png',
                mimetype: 'image/png',
                size: 1231
            }),
            File.create({
                _id: '00000000000000aaee000002',
                originalname: 'Testing file 02.png',
                filename: '1658229833945_testing-file-02.png',
                mimetype: 'image/png',
                size: 1232
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
                name: 'Testing company 01',
                description: 'This is a testing company with id 01',
                logo: '00000000000000aaee000001'
            }),
            Producer.create({
                _id: '00000000000000aaaa000002',
                name: 'Testing company 02',
                description: 'This is a testing company with id 02',
                logo: '00000000000000aaee000002'
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

    afterEach(() => {
        return Production.deleteMany({});
    });

    after(() => {
        return Promise.all([
            Producer.deleteMany({}),
            File.deleteMany({}),
            User.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should return Unauthorized without token', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(401)
            .then((response) => {
                response.body.code.should.be.equal('unauthorized');
                response.body.message.should.be.equal('Unauthorized');
            });
    });

    it('Should return Unauthorized without producer role', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(401)
            .then((response) => {
                response.body.code.should.be.equal('unauthorized');
                response.body.message.should.be.equal('Unauthorized');
            });
    });

    it('Should fail without productName', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "productName" is required');
            });
    });

    it('Should fail without producedAt', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "producedAt" is required');
            });
    });

    it('Should fail with future date producedAt', function() {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 2);
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: futureDate,
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "producedAt" must be less than "now"');
            });
    });

    it('Should fail without batch', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "batch" is required');
            });
    });

    it('Should fail without totalQuantity', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000003'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "totalQuantity" is required');
            });
    });

    it('Should fail with invalid image id', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: 'asd',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "image" must only contain hexadecimal characters');
            });
    });

    it('Should fail with invalid image id', function() {
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000004',
                totalQuantity: 100
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_image_id');
                response.body.message.should.be.equal('Invalid image id');
            });
    });

    it('Should save data', function() {
        let newId;
        return request(application)
            .post('/api/productions')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Almohadón',
                productDescription: '50cm x 50cm',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: '00020071',
                image: '00000000000000aaee000003',
                totalQuantity: 100
            })
            .expect(201)
            .then((response) => {
                newId = response.body._id;
                response.body.producer.should.be.equal('00000000000000aaaa000001');
                response.body.productName.should.be.equal('Almohadón');
                response.body.productDescription.should.be.equal('50cm x 50cm');
                response.body.producedAt.should.be.equal('2022-07-01T03:00:00.000Z');
                response.body.batch.should.be.equal('00020071');
                response.body.image.should.be.equal('00000000000000aaee000003');
                response.body.totalQuantity.should.be.equal(100);
                response.body.availableQuantity.should.be.equal(100);
                response.body.status.should.be.equal('pending');
                return Production.find();
            })
            .then((productions) => {
                productions.should.have.length(1);
                productions[0]._id.toString().should.be.equal(newId);
                productions[0].producer.toString().should.be.equal('00000000000000aaaa000001');
                productions[0].productName.should.be.equal('Almohadón');
                productions[0].productDescription.should.be.equal('50cm x 50cm');
                productions[0].producedAt.toISOString().should.be.equal('2022-07-01T03:00:00.000Z');
                productions[0].batch.should.be.equal('00020071');
                productions[0].image.toString().should.be.equal('00000000000000aaee000003');
                productions[0].totalQuantity.should.be.equal(100);
                productions[0].availableQuantity.should.be.equal(100);
                productions[0].status.should.be.equal('pending');
            });
    });
});
