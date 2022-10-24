'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {FutureProductionOffer, User, File} = require('@models');

describe('POST /futureproductionoffers', function() {
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
            User.deleteMany({}),
            FutureProductionOffer.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should save data', function() {
        return request(application)
            .post('/api/futureproductionoffers')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .send({
                productName: 'Product testing 01',
                productDescription: 'Bottle of 700mg',
                description: 'Botella grande de 500mgmgmgmg',
                expiredAt: '2023-04-01T03:00:00.000Z',
                availabledAt: '2023-02-02T03:00:00.000Z',
                totalQuantity: 500,
                priceAmount: 50,
                priceTokenAddress: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                image: '00000000000000aaee000001'
            })
            .expect(201)
            .then((response) => {
                response.body.producer.should.be.equal('00000000000000aaaa000001');
                response.body.productName.should.be.equal('Product testing 01');
                response.body.productDescription.should.be.equal('Bottle of 700mg');
                response.body.description.should.be.equal('Botella grande de 500mgmgmgmg');
                response.body.expiredAt.should.be.equal('2023-04-01T03:00:00.000Z');
                response.body.availabledAt.should.be.equal('2023-02-02T03:00:00.000Z');
                response.body.totalQuantity.should.be.equal(500);
                response.body.priceAmount.should.be.equal(50);
                response.body.priceTokenAddress.should.be.equal(process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS);
                response.body.priceTokenName.should.be.equal('USD Coin');
                response.body.priceTokenSymbol.should.be.equal('USDC');
                response.body.priceTokenDecimals.should.be.equal(6);
                response.body.image.should.be.equal('00000000000000aaee000001');
                response.body.status.should.be.equal('pending');
                return FutureProductionOffer.find();
            })
            .then((productions) => {
                productions.should.have.length(1);
                productions[0].producer.toString().should.be.equal('00000000000000aaaa000001');
                productions[0].productName.should.be.equal('Product testing 01');
                productions[0].productDescription.should.be.equal('Bottle of 700mg');
                productions[0].description.should.be.equal('Botella grande de 500mgmgmgmg');
                productions[0].expiredAt.toISOString().should.be.equal('2023-04-01T03:00:00.000Z');
                productions[0].availabledAt.toISOString().should.be.equal('2023-02-02T03:00:00.000Z');
                productions[0].totalQuantity.should.be.equal(500);
                productions[0].priceAmount.should.be.equal(50);
                productions[0].priceTokenAddress.should.be.equal(process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS);
                productions[0].priceTokenName.should.be.equal('USD Coin');
                productions[0].priceTokenSymbol.should.be.equal('USDC');
                productions[0].priceTokenDecimals.should.be.equal(6);
                productions[0].image.toString().should.be.equal('00000000000000aaee000001');
                productions[0].status.should.be.equal('pending');
            });
    });
    it('Should return unauthorized without token', function() {
        return request(application)
            .post('/api/futureproductionoffers')
            .set('Accept', 'application/json')
            .send({
                productName: 'Product testing 01',
                productDescription: 'Bottle of 700mg',
                description: 'Botella grande de 500mgmgmgmg',
                expiredAt: '2023-04-01T03:00:00.000Z',
                availabledAt: '2023-02-02T03:00:00.000Z',
                totalQuantity: 500,
                priceAmount: 50,
                priceTokenAddress: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                image: '00000000000000aaee000001',
                status: 'pending'
            })
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return unauthorized if i send data with admin role', function() {
        return request(application)
            .post('/api/futureproductionoffers')
            .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
            .set('Accept', 'application/json')
            .send({
                productName: 'Product testing 01',
                productDescription: 'Bottle of 700mg',
                description: 'Botella grande de 500mgmgmgmg',
                expiredAt: '2023-04-01T03:00:00.000Z',
                availabledAt: '2023-02-02T03:00:00.000Z',
                totalQuantity: 500,
                priceAmount: 50,
                priceTokenAddress: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                image: '00000000000000aaee000001',
                status: 'pending'
            })
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return bad request (INVALID FIELDS), if i send wrong data', function() {
        return request(application)
            .post('/api/futureproductionoffers')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .set('Accept', 'application/json')
            .send({
                productName: 'Product testing 01',
                productDescription: 'Bottle of 700mg',
                description: 'Botella grande de 500mgmgmgmg',
                expiredAt: '2021-04-01T03:00:00.000Z',
                availabledAt: '2023-02-02T03:00:00.000Z',
                totalQuantity: 500,
                priceAmount: 50,
                priceTokenAddress: process.env.TESTING_BLOCKCHAIN_SC_ERC20TOKEN_1_ADDRESS,
                image: '00000000000000aaee000001',
                status: 'pending'
            })
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Invalid field - "expiredAt" must be greater than "now"');
                response.body.code.should.be.equal('invalid_fields');
            });
    });
});
