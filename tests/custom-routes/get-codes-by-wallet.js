'use strict';

const app = require('../mocks/app');
const request = require('supertest');
require('should');
const {Producer, Production, ProductionRewardCode} = require('@models');
const {Types} = require('mongoose');

describe('GET /codes/wallet/:wallet', () => {
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
                publishedAt: new Date('2022-08-01T15:30:00.000Z'),
                batch: 'testing0002',
                totalQuantity: 3,
                availableQuantity: 3,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aadd000003',
                producer: '00000000000000aacc000003',
                productName: 'Miel',
                productDescription: 'Frasco de 600mg',
                producedAt: new Date('2022-07-01T03:00:00.000Z'),
                publishedAt: new Date('2022-08-01T15:30:00.000Z'),
                batch: 'testing0003',
                totalQuantity: 5,
                availableQuantity: 3,
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
                walletAddress: 'fakewalletaddress02',
                transactionId: 'faketransactionid01'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002-1',
                status: 'used',
                walletAddress: 'fakewalletaddress02',
                transactionId: 'faketransactionid02'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002-2',
                status: 'used',
                walletAddress: 'fakewalletaddress02',
                transactionId: 'faketransactionid03'
            }),
            ProductionRewardCode.create({
                production: '00000000000000aadd000002',
                code: '002-3',
                status: 'available'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            ProductionRewardCode.deleteMany({}),
            Production.deleteMany({}),
            Producer.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should return empty data with invalid wallet', () => {
        return request(application)
            .get('/api/codes/wallet/fakewalletaddress03')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.should.have.length(0);
            })
    });

    it('Should return data productions', () => {
        return request(application)
            .get('/api/codes/wallet/fakewalletaddress02')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                response.body.should.have.length(2);
                response.body.should.containDeep([{
                    _id: '00000000000000aadd000001',
                    producer: '00000000000000aacc000001',
                    productName: 'Miel',
                    productDescription: 'Frasco de 200mg',
                    producedAt: '2022-06-01T03:00:00.000Z',
                    publishedAt: '2022-08-01T15:30:00.000Z',
                    batch: 'testing0001',
                    totalQuantity: 4,
                    availableQuantity: 2,
                    status: 'active',
                }, {
                    _id: '00000000000000aadd000002',
                    producer: '00000000000000aacc000002',
                    productName: 'Miel',
                    productDescription: 'Frasco de 500mg',
                    producedAt: '2022-07-01T03:00:00.000Z',
                    publishedAt: '2022-08-01T15:30:00.000Z',
                    batch: 'testing0002',
                    totalQuantity: 3,
                    availableQuantity: 3,
                    status: 'active',
                }]);
            })
    });
});
