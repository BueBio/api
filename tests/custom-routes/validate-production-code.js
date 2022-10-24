'use strict';

const app = require('../mocks/app');
const request = require('supertest');
require('should');
const {Production, ProductionRewardCode} = require('@models');

describe('GET /codes/validat/:code', () => {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
            Production.create({
                _id: '00000000000000aadd000001',
                producer: '00000000000000aacc000001',
                productName: 'Miel',
                productDescription: 'Frasco de 200mg',
                producedAt: new Date('2022-06-01T03:00:00.000Z'),
                publishedAt: new Date('2022-08-01T15:30:00.000Z'),
                batch: 'testing0001',
                totalQuantity: 4,
                availableQuantity: 2,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aadd000002',
                producer: '00000000000000aacc000001',
                productName: 'Miel',
                productDescription: 'Frasco de 100mg',
                producedAt: new Date('2022-06-01T03:00:00.000Z'),
                publishedAt: new Date('2022-08-01T15:30:00.000Z'),
                batch: 'testing0002',
                totalQuantity: 3,
                availableQuantity: 2,
                status: 'active'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-1',
                status: 'available'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-2',
                status: 'used'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-3',
                status: 'cancelled'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002',
                status: 'available'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002',
                status: 'used'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002',
                status: 'available'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            ProductionRewardCode.deleteMany({}),
            Production.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should fail with invalid code', () => {
        return request(application)
            .get('/api/codes/validate/001-10')
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Invalid or used reward code');
                response.body.code.should.be.equal('invalid_or_used_code');
            });
    });

    it('Should fail with code in use', () => {
        return request(application)
            .get('/api/codes/validate/001-2')
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Invalid or used reward code');
                response.body.code.should.be.equal('invalid_or_used_code');
            });
    });

    it('Should fail with code canceled', () => {
        return request(application)
            .get('/api/codes/validate/001-3')
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Invalid or used reward code');
                response.body.code.should.be.equal('invalid_or_used_code');
            });
    });

    it('Should return code and data code (with unique code)', () => {
        return request(application)
            .get('/api/codes/validate/001-1')
            .expect(200)
            .then((response) => {
                
                response.body.code.should.be.equal('001-1');
                response.body.status.should.be.equal('available');
                response.body.production._id.toString().should.be.equal('00000000000000aadd000001');
                response.body.production.productName.should.be.equal('Miel');
                response.body.production.productDescription.should.be.equal('Frasco de 200mg');
                response.body.production.batch.should.be.equal('testing0001');
                response.body.production.totalQuantity.should.be.equal(4);
                response.body.production.availableQuantity.should.be.equal(2);
                response.body.production.status.should.be.equal('active');
            });
    });

    it('Should return code and data code (with repeated code)', () => {
        return request(application)
            .get('/api/codes/validate/002')
            .expect(200)
            .then((response) => {
                
                response.body.code.should.be.equal('002');
                response.body.status.should.be.equal('available');
                response.body.production._id.toString().should.be.equal('00000000000000aadd000002');
                response.body.production.productName.should.be.equal('Miel');
                response.body.production.productDescription.should.be.equal('Frasco de 100mg');
                response.body.production.batch.should.be.equal('testing0002');
                response.body.production.totalQuantity.should.be.equal(3);
                response.body.production.availableQuantity.should.be.equal(2);
                response.body.production.status.should.be.equal('active');
            });
    });
});
