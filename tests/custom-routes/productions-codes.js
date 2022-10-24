'use strict';
const app = require('../mocks/app');
const request = require('supertest');
require('should');
const {User, Producer, Production, ProductionRewardCode} = require('@models');

describe('GET /productions/:id/codes', () => {
    let application;
    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return User.deleteMany({});
            });
    });
    
    before(() => {
        return Promise.all([
            User.create({
                _id: '00000000000000ddaa000001',
                fullname: 'Admin',
                email: 'admin01@mail.com',
                role: 'admin',
                password: 'soyunapassword'
            }),
            User.create({
                _id: '00000000000000ddab000001',
                fullname: 'Producer 01',
                email: 'producer01@mail.com',
                role: 'producer',
                password: 'soyunapassword',
                producer: '00000000000000aacc000001'
            }),
            User.create({
                _id: '00000000000000ddab000002',
                fullname: 'Producer 02',
                email: 'producer02@mail.com',
                role: 'producer',
                password: 'soyunapassword',
                producer: '00000000000000aacc000002'
            }),
            Producer.create({
                _id: '00000000000000aacc000001',
                name: 'Testing producer 1',
                description: 'A testing producer'
            }),
            Producer.create({
                _id: '00000000000000aacc000002',
                name: 'Testing producer 2',
                description: 'A testing producer'
            }),
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
                producer: '00000000000000aacc000002',
                productName: 'Miel',
                productDescription: 'Frasco de 500mg',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                batch: 'testing0002',
                totalQuantity: 3,
                availableQuantity: 3,
                status: 'pending'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-1',
                status: 'available'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-2',
                status: 'available'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-3',
                status: 'used',
                walletAddress: 'fakewalletaddress01'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000001',
                code: '001-4',
                status: 'used',
                walletAddress: 'fakewalletaddress02'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002',
                status: 'available'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002',
                status: 'available'
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
            Production.deleteMany({}),
            Producer.deleteMany({}),
            User.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should fail without token', () => {
        return request(application)
            .get('/api/productions/00000000000000aadd000001/codes')
            .set('Accept', 'application/json')
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should fail with another producer production', () => {
        return request(application)
            .get('/api/productions/00000000000000aadd000002/codes')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .expect(401)
            .then((response) => {
                response.body.message.should.be.equal('Unauthorized');
                response.body.code.should.be.equal('unauthorized');
            });
    });

    it('Should return codes with admin role', () => {
        return request(application)
            .get('/api/productions/00000000000000aadd000001/codes')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
            .expect(200)
            .then((response) => {
                response.body.should.have.length(4);
                response.body.should.containDeep([{
                    production: '00000000000000aadd000001',
                    code: '001-1',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-2',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-3',
                    status: 'used',
                    walletAddress: 'fakewalletaddress01'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-4',
                    status: 'used',
                    walletAddress: 'fakewalletaddress02'
                }]);
            });
    });

    it('Should return codes with producer rol', () => {
        return request(application)
            .get('/api/productions/00000000000000aadd000001/codes')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .expect(200)
            .then((response) => {
                response.body.should.have.length(4);
                response.body.should.containDeep([{
                    production: '00000000000000aadd000001',
                    code: '001-1',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-2',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-3',
                    status: 'used',
                    walletAddress: 'fakewalletaddress01'
                }, {
                    production: '00000000000000aadd000001',
                    code: '001-4',
                    status: 'used',
                    walletAddress: 'fakewalletaddress02'
                }]);
            });
    });

    it('Should return codes with producer rol', () => {
        return request(application)
            .get('/api/productions/00000000000000aadd000002/codes')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_02_TOKEN}`)
            .expect(200)
            .then((response) => {
                response.body.should.have.length(3);
                response.body.should.containDeep([{
                    production: '00000000000000aadd000002',
                    code: '002',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000002',
                    code: '002',
                    status: 'available'
                }, {
                    production: '00000000000000aadd000002',
                    code: '002',
                    status: 'available'
                }]);
            });
    });
});
