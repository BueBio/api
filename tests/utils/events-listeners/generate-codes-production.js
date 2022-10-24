'use strict';
const app = require('../../mocks/app');
const should = require('should');
const generateCodesProduction = require('@utils/events-listeners/generate-codes-production');
const {Production, ProductionRewardCode} = require('@models');
const {Types} = require('mongoose');

describe('Utils - events-listeners - generate-codes-production', () => {
    before(() => {
        return app.start();
    });

    before(() => {
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
            })
        ]);
    });

    after(() => {
        return Promise.all([
            Production.deleteMany({}),
            ProductionRewardCode.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should save a new transaction', function() {
        return generateCodesProduction('00000000000000aabb000001')
            .then(() => {
                return ProductionRewardCode.find();
            })
            .then((productionRewardCodes) => {
                productionRewardCodes.should.have.length(10);
                productionRewardCodes.should.containDeep([{
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }, {
                    production: Types.ObjectId('00000000000000aabb000001'),
                    status: 'available'
                }]);
                return ProductionRewardCode.find().count();
            })
            .then((productionRewardCodes) => {
                productionRewardCodes.should.be.equal(10);
            });
    });
});
